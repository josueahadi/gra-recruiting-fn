import { configureStore } from "@reduxjs/toolkit";
import authReducer, { initializeAuth } from "./slices/auth-slice";
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	createTransform,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import createEncryptor from "redux-persist-transform-encrypt";

const SECRET_KEY = "growrwanda-auth-2024";

const authTransform = createTransform(
	(inboundState, key) => {
		if (key === "auth") {
			const stateToSave = { ...inboundState };
			return stateToSave;
		}
		return inboundState;
	},
	(outboundState, key) => {
		if (key === "auth") {
			return outboundState;
		}
		return outboundState;
	},
	{ whitelist: ["auth"] },
);
const persistConfig = {
	key: "gra-auth",
	storage,
	whitelist: ["token", "isAuthenticated", "decodedToken"],
	transforms: [authTransform],
};

try {
	const encryptor = createEncryptor({
		secretKey: SECRET_KEY,
		onError: (error) => {
			console.error("Redux persist encryption error:", error);
		},
	});

	persistConfig.transforms.push(encryptor);
	console.log("Redux persistence encryption enabled");
} catch (error) {
	console.error("Failed to initialize redux-persist encryption:", error);
	console.log("Continuing without encryption");
}
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
	reducer: {
		auth: persistedAuthReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
				ignoredPaths: ["auth.decodedToken"],
			},
		}),
});

store.dispatch(initializeAuth());

export const persistor = persistStore(store);

export const resetPersistedState = () => {
	return persistor.purge();
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
