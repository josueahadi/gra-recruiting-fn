import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
	apiKey: "AIzaSyDa48wDXrlxleTTXH4Tnw-L6gsGTTeKJTw",
	authDomain: "gra-recruiting-a9819.firebaseapp.com",
	projectId: "gra-recruiting-a9819",
	storageBucket: "gra-recruiting-a9819.firebasestorage.app",
	messagingSenderId: "635063901971",
	appId: "1:635063901971:web:a38d04a70116b69cb604e6",
	measurementId: "G-9GHTFE1F38",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
