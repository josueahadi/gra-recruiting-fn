type QueuedOperation<T> = {
	id: string;
	operation: () => Promise<T>;
	resolve: (value: T | PromiseLike<T>) => void;
	reject: (reason?: any) => void;
	retries?: number;
};

export class ApiQueueManager {
	private queue: QueuedOperation<any>[] = [];
	private processing = false;
	private delayBetweenRequests: number;
	private maxRetries: number;
	private retryDelay: number;

	constructor(
		options: {
			delayBetweenRequests?: number;
			maxRetries?: number;
			retryDelay?: number;
		} = {},
	) {
		this.delayBetweenRequests = options.delayBetweenRequests || 300; // ms
		this.maxRetries = options.maxRetries || 3;
		this.retryDelay = options.retryDelay || this.delayBetweenRequests;
	}

	enqueue<T>(
		operation: () => Promise<T>,
		id: string = `op-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
	): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			this.queue.push({
				id,
				operation,
				resolve,
				reject,
				retries: 0,
			});

			if (!this.processing) {
				this.processQueue();
			}
		});
	}

	private async processQueue() {
		if (this.processing || this.queue.length === 0) {
			return;
		}

		this.processing = true;

		const item = this.queue.shift();
		if (!item) {
			this.processing = false;
			return;
		}

		try {
			let result;
			let error;
			let retries = item.retries || 0;

			while (retries <= this.maxRetries) {
				try {
					result = await item.operation();
					break;
				} catch (err) {
					error = err;
					retries++;

					if (retries <= this.maxRetries) {
						const delay = this.retryDelay * Math.pow(2, retries - 1);
						console.log(
							`[ApiQueueManager] Retry ${retries}/${this.maxRetries} after ${delay}ms for operation ${item.id}`,
						);
						await new Promise((resolve) => setTimeout(resolve, delay));
					}
				}
			}

			if (result !== undefined) {
				item.resolve(result);
			} else {
				item.reject(
					error ||
						new Error(`Operation ${item.id} failed after ${retries} retries`),
				);
			}
		} catch (finalError) {
			console.error(
				`[ApiQueueManager] Unhandled error in operation ${item.id}:`,
				finalError,
			);
			item.reject(finalError);
		} finally {
			await new Promise((resolve) =>
				setTimeout(resolve, this.delayBetweenRequests),
			);

			this.processing = false;

			if (this.queue.length > 0) {
				this.processQueue();
			}
		}
	}

	clear(): number {
		const pendingOperations = [...this.queue];
		const count = pendingOperations.length;
		this.queue = [];

		pendingOperations.forEach((item) => {
			item.reject(new Error(`Operation ${item.id} cancelled`));
		});

		return count;
	}

	get pendingCount(): number {
		return this.queue.length;
	}

	get isProcessing(): boolean {
		return this.processing;
	}

	get config() {
		return {
			delayBetweenRequests: this.delayBetweenRequests,
			maxRetries: this.maxRetries,
			retryDelay: this.retryDelay,
		};
	}
}

export const languageApiQueue = new ApiQueueManager({
	delayBetweenRequests: 500,
	maxRetries: 2,
	retryDelay: 1000,
});

export const skillApiQueue = new ApiQueueManager({
	delayBetweenRequests: 300,
	maxRetries: 2,
	retryDelay: 800,
});

export async function batchOperations<T>(
	operations: Array<() => Promise<T>>,
	queueManager: ApiQueueManager = languageApiQueue,
	batchSize: number = 3,
): Promise<T[]> {
	const results: T[] = [];
	const errors: any[] = [];

	for (let i = 0; i < operations.length; i += batchSize) {
		const batch = operations.slice(i, i + batchSize);
		const batchPromises = batch.map((op, index) =>
			queueManager.enqueue(op, `batch-${i}-op-${index}`),
		);

		const batchResults = await Promise.allSettled(batchPromises);

		batchResults.forEach((result, index) => {
			if (result.status === "fulfilled") {
				results.push(result.value);
			} else {
				console.error(
					`[batchOperations] Operation in batch ${i}, index ${index} failed:`,
					result.reason,
				);
				errors.push(result.reason);
			}
		});
	}

	console.log(
		`[batchOperations] Completed ${results.length}/${operations.length} operations with ${errors.length} failures`,
	);

	return results;
}

export async function batchLanguageOperations<T>(
	operations: Array<() => Promise<T>>,
	batchSize: number = 3,
): Promise<T[]> {
	return batchOperations(operations, languageApiQueue, batchSize);
}

export async function batchSkillOperations<T>(
	operations: Array<() => Promise<T>>,
	batchSize: number = 3,
): Promise<T[]> {
	return batchOperations(operations, skillApiQueue, batchSize);
}

export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export default {
	ApiQueueManager,
	languageApiQueue,
	skillApiQueue,
	batchOperations,
	batchLanguageOperations,
	batchSkillOperations,
	delay,
};
