import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
	apiKey: "AIzaSyBDAZMgODQG5ENviPjmPLMnFG0EnPeBD7g",
	authDomain: "xcaregiverrecruiting.firebaseapp.com",
	projectId: "xcaregiverrecruiting",
	storageBucket: "xcaregiverrecruiting.appspot.com",
	messagingSenderId: "571772921663",
	appId: "1:571772921663:web:bbb26858441330ac52558a",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
