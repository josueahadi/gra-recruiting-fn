import { useState, useCallback, useEffect } from "react";

export function useOptimisticUpdate<T>(initialState: T) {
	const [state, setState] = useState<T>(initialState);
	const [previousState, setPreviousState] = useState<T>(initialState);
	const [isUpdating, setIsUpdating] = useState(false);
	const [updateError, setUpdateError] = useState<Error | null>(null);

	useEffect(() => {
		if (!isUpdating) {
			setState(initialState);
			setPreviousState(initialState);
		}
	}, [initialState, isUpdating]);

	const update = useCallback(
		async <R>(
			updateFn: (currentState: T) => T,
			apiCall: (newState: T) => Promise<R>,
		): Promise<R> => {
			setUpdateError(null);
			setIsUpdating(true);

			setPreviousState(state);

			const updatedState = updateFn(state);
			setState(updatedState);

			try {
				const result = await apiCall(updatedState);
				setIsUpdating(false);
				return result;
			} catch (error) {
				setState(previousState);
				setUpdateError(
					error instanceof Error ? error : new Error(String(error)),
				);
				setIsUpdating(false);
				throw error;
			}
		},
		[state, previousState],
	);

	const updatePartial = useCallback(
		async <R, K extends keyof T>(
			key: K,
			partialUpdateFn: (currentPartialState: T[K]) => T[K],
			apiCall: (newPartialState: T[K]) => Promise<R>,
		): Promise<R> => {
			setUpdateError(null);
			setIsUpdating(true);

			setPreviousState(state);

			const updatedPartialState = partialUpdateFn(state[key]);
			setState({
				...state,
				[key]: updatedPartialState,
			});

			try {
				const result = await apiCall(updatedPartialState);
				setIsUpdating(false);
				return result;
			} catch (error) {
				setState(previousState);
				setUpdateError(
					error instanceof Error ? error : new Error(String(error)),
				);
				setIsUpdating(false);
				throw error;
			}
		},
		[state, previousState],
	);

	const reset = useCallback(() => {
		setState(initialState);
		setPreviousState(initialState);
		setUpdateError(null);
		setIsUpdating(false);
	}, [initialState]);

	const clearError = useCallback(() => {
		setUpdateError(null);
	}, []);

	return {
		state,
		setState,
		isUpdating,
		updateError,
		update,
		updatePartial,
		reset,
		clearError,
	};
}
