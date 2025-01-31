"use client";

// import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

// const TOAST_LIMIT = 1;
// const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
	id: string;
	title?: React.ReactNode;
	description?: React.ReactNode;
	action?: ToastActionElement;
};

type ActionType = {
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
			type: ActionType["ADD_TOAST"];
			toast: ToasterToast;
	  }
	| {
			type: ActionType["UPDATE_TOAST"];
			toast: Partial<ToasterToast>;
	  }
	| {
			type: ActionType["DISMISS_TOAST"];
			toastId?: ToasterToast["id"];
	  }
	| {
			type: ActionType["REMOVE_TOAST"];
			toastId?: ToasterToast["id"];
	  };

// ...existing code...
