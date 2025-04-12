import { configureStore } from "@reduxjs/toolkit";
import authReducer, { initializeAuth } from "./slices/auth-slice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
	key: "gra-auth",
	storage,
	whitelist: ["token", "isAuthenticated", "user", "decodedToken"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
	reducer: {
		auth: persistedAuthReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
				ignoredPaths: ["auth.decodedToken"],
			},
		}),
});

store.dispatch(initializeAuth());

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
