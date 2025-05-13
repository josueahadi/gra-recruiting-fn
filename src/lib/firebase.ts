import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
	apiKey: "AIzaSyCvttAwcUJHtjVpjW1_KC-_Tb7B8_Ownms",
	authDomain: "gra-recruiting-fn.firebaseapp.com",
	projectId: "gra-recruiting-fn",
	storageBucket: "gra-recruiting-fn.firebasestorage.app",
	messagingSenderId: "956805407689",
	appId: "1:956805407689:web:d01813c2e9f9db7ab87e18",
	measurementId: "G-5GPFFRFJML",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
