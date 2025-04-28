type QueuedOperation<T> = {
	id: string;
	operation: () => Promise<T>;
	resolve: (value: T | PromiseLike<T>) => void;
	reject: (reason?: any) => void;
};

// Queue manager class
export class ApiQueueManager {
	private queue: QueuedOperation<any>[] = [];
	private processing = false;
	private delayBetweenRequests: number;
	private maxRetries: number;

	constructor(
		options: {
			delayBetweenRequests?: number;
			maxRetries?: number;
		} = {},
	) {
		this.delayBetweenRequests = options.delayBetweenRequests || 300; // ms
		this.maxRetries = options.maxRetries || 3;
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
			let retries = 0;

			while (retries <= this.maxRetries) {
				try {
					result = await item.operation();
					break;
				} catch (err) {
					error = err;
					retries++;

					if (retries <= this.maxRetries) {
						await new Promise((resolve) =>
							setTimeout(
								resolve,
								this.delayBetweenRequests * Math.pow(2, retries - 1),
							),
						);
					}
				}
			}

			if (result !== undefined) {
				item.resolve(result);
			} else {
				item.reject(error || new Error("Operation failed after retries"));
			}
		} catch (finalError) {
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

	clear() {
		const pendingOperations = [...this.queue];
		this.queue = [];

		pendingOperations.forEach((item) => {
			item.reject(new Error("Operation cancelled"));
		});
	}

	get pendingCount(): number {
		return this.queue.length;
	}
}

export const languageApiQueue = new ApiQueueManager({
	delayBetweenRequests: 500,
	maxRetries: 2,
});

export async function batchLanguageOperations<T>(
	operations: Array<() => Promise<T>>,
	batchSize: number = 3,
): Promise<T[]> {
	const results: T[] = [];

	for (let i = 0; i < operations.length; i += batchSize) {
		const batch = operations.slice(i, i + batchSize);
		const batchPromises = batch.map((op) => languageApiQueue.enqueue(op));

		const batchResults = await Promise.allSettled(batchPromises);

		batchResults.forEach((result) => {
			if (result.status === "fulfilled") {
				results.push(result.value);
			} else {
				console.error("Batch operation failed:", result.reason);
			}
		});
	}

	return results;
}

export default {
	ApiQueueManager,
	languageApiQueue,
	batchLanguageOperations,
};
