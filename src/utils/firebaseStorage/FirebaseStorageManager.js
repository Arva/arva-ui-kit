/**
 * Created by Manuel on 22/09/16.
 */

import firebase                     from 'firebase';

export class FirebaseStorageManager {

    /**
     * Class for managing firebaseStorage
     */
    constructor() {
        this.storage = firebase.storage();
        this.storageRef = this.storage.ref();
    }


    /**
     * Upload a fileBlob to a firebase location
     * @param fileBlob
     * @param fileLocation
     * @param fileName
     * @returns {Promise}
     */
    uploadFile(fileBlob = {}, fileLocation = 'images', fileName = new Date().toString()) {
        return new Promise((resolve, reject)=> {
            let fileRef = this.storageRef.child(`${fileLocation}/${fileName}`);
            let uploadTask = fileRef.put(fileBlob);

            uploadTask.on('state_changed', function (snapshot) {
            }, function (error) {
                reject(error);
            }, function () {
                resolve(uploadTask.snapshot.downloadURL);
            });
        });
    }


}