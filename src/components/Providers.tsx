"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";
import React, { type FC, type PropsWithChildren } from "react";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000, // 1 minute
			refetchOnWindowFocus: false,
		},
	},
});

const Providers: FC<PropsWithChildren> = ({ children }) => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<QueryClientProvider client={queryClient}>
					{children}
					<Toaster />
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</PersistGate>
		</Provider>
	);
};

export default Providers;
