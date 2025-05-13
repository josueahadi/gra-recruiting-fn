import {
	ref,
	uploadBytes,
	getDownloadURL,
	uploadBytesResumable,
} from "firebase/storage";
import type { UploadTask, UploadTaskSnapshot } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadFileToFirebase(
	file: File,
	path: string,
): Promise<string> {
	const storageRef = ref(storage, path);
	await uploadBytes(storageRef, file);
	return getDownloadURL(storageRef);
}

export function uploadFileToFirebaseWithProgress(
	file: File,
	path: string,
	onProgress?: (progress: number) => void,
): Promise<string> {
	return new Promise((resolve, reject) => {
		const storageRef = ref(storage, path);
		const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot: UploadTaskSnapshot) => {
				if (onProgress) {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					onProgress(progress);
				}
			},
			(error) => {
				reject(error);
			},
			async () => {
				const url = await getDownloadURL(uploadTask.snapshot.ref);
				resolve(url);
			},
		);
	});
}
