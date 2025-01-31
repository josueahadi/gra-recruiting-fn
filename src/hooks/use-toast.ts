"use client";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";
import * as React from "react";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
	id: string;
	title?: React.ReactNode;
	description?: React.ReactNode;
	action?: ToastActionElement;
	dismissible?: boolean;
};

type State = {
	toasts: ToasterToast[];
};

type ActionTypes = {
	ADD_TOAST: "ADD_TOAST";
	UPDATE_TOAST: "UPDATE_TOAST";
	DISMISS_TOAST: "DISMISS_TOAST";
	REMOVE_TOAST: "REMOVE_TOAST";
};

let count = 0;

function genId() {
	count = (count + 1) % Number.MAX_SAFE_INTEGER;
	return count.toString();
}

type Action =
	| {
			type: ActionTypes["ADD_TOAST"];
			toast: ToasterToast;
	  }
	| {
			type: ActionTypes["UPDATE_TOAST"];
			toast: Partial<ToasterToast>;
	  }
	| {
			type: ActionTypes["DISMISS_TOAST"];
			toastId?: ToasterToast["id"];
	  }
	| {
			type: ActionTypes["REMOVE_TOAST"];
			toastId?: ToasterToast["id"];
	  };

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "ADD_TOAST":
			return {
				...state,
				toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
			};

		case "UPDATE_TOAST":
			return {
				...state,
				toasts: state.toasts.map((t) =>
					t.id === action.toast.id ? { ...t, ...action.toast } : t,
				),
			};

		case "DISMISS_TOAST": {
			const { toastId } = action;

			return {
				...state,
				toasts: state.toasts.map((t) =>
					t.id === toastId || toastId === undefined
						? {
								...t,
								open: false,
							}
						: t,
				),
			};
		}

		case "REMOVE_TOAST":
			if (action.toastId === undefined) {
				return {
					...state,
					toasts: [],
				};
			}
			return {
				...state,
				toasts: state.toasts.filter((t) => t.id !== action.toastId),
			};
	}
};

export function useToast() {
	const [state, dispatch] = React.useReducer(reducer, {
		toasts: [],
	});

	React.useEffect(() => {
		state.toasts.forEach((toast) => {
			if (toast.dismissible !== false && !toast.duration) {
				toast.duration = 5000;
			}

			if (toast.open) {
				if (toastTimeouts.has(toast.id)) {
					return;
				}

				const timeout = setTimeout(() => {
					dispatch({
						type: "DISMISS_TOAST",
						toastId: toast.id,
					});

					setTimeout(() => {
						dispatch({
							type: "REMOVE_TOAST",
							toastId: toast.id,
						});
					}, TOAST_REMOVE_DELAY);
				}, toast.duration);

				toastTimeouts.set(toast.id, timeout);
			} else {
				const timeout = toastTimeouts.get(toast.id);
				if (timeout) {
					clearTimeout(timeout);
					toastTimeouts.delete(toast.id);
				}
			}
		});
	}, [state.toasts]);

	const toast = React.useCallback(({ ...props }: Omit<ToasterToast, "id">) => {
		const id = genId();

		dispatch({
			type: "ADD_TOAST",
			toast: {
				...props,
				id,
				open: true,
			},
		});

		return id;
	}, []);

	const dismiss = React.useCallback((toastId?: string) => {
		dispatch({
			type: "DISMISS_TOAST",
			toastId,
		});
	}, []);

	return {
		toasts: state.toasts,
		toast,
		dismiss,
	};
}
