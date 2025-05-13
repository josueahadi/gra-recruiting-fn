"use client";

import { Button } from "@/components/ui/button";
import React from "react";

interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("Error caught by boundary:", error, errorInfo);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						Something went wrong
					</h2>
					<p className="text-gray-600 mb-6">
						{this.state.error?.message || "An unexpected error occurred"}
					</p>
					<Button
						onClick={this.handleReset}
						className="bg-green-500 hover:bg-green-600 text-white"
					>
						Refresh
					</Button>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
