import {
    ref,
    uploadBytesResumable,
    getDownloadURL 
} from "firebase/storage";
import storage from "../../firebaseConfig";

export function uploadFile(file: File) {
    return new Promise((resolve, reject) => {
        if (!file) {
            alert("Please choose a file first!")
        }
        
        const fileName = ((file.name).split('.'))[0] + '-' + Date.now();
        const storageRef = ref(storage,`/files/${fileName}`)
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
        
                // update progress
                // setPercent(percent);
            },
            (err) => {
                console.log(err)
                reject(err)
            },
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                    resolve(url)
                });
            }
        );
    })
}