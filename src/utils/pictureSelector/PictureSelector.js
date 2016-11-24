/**
 * Created by Manuel on 22/09/16.
 */

import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {FirebaseStorageManager}     from '../firebaseStorage/FirebaseStorageManager.js';

export class PictureSelector {

    static getDefaultOptions() {
        return {
            // Some common settings are 20, 50, and 100
            quality: 50,
            // targetHeight: 944 /* not in the scope, and not fully working when capturing an image */,
            // targetWidth: 500 /* not in the scope, and not fully working when capturing an image */,
            destinationType: navigator.camera.DestinationType.FILE_URI, /* Don't use DATA_URL options, as this causes memory issues */
            sourceType: '', /* Camera.PictureSourceType.CAMERA | Camera.PictureSourceType.SAVEDPHOTOALBUM */
            encodingType: navigator.camera.EncodingType.JPEG,
            mediaType: navigator.camera.MediaType.PICTURE,
            allowEdit: false, /* Causes issues on Android, as editing software can greatly differ between devices, causing unexpected results/crashes */
            correctOrientation: true  //Corrects Android orientation quirks
        }
    };

    /**
     * Fetch in image from camera/library, and upload the file directly to firebase
     * Returns a firebase download link
     * @param usesCamera
     * @param fileLocation {Optional: fileLocation within firebase}
     * @param fileName {Optional: fileName within firebase}
     * @returns {Promise}
     */
    static async fetchPicture(usesCamera = true, fileLocation = undefined, fileName = undefined) {
        PictureSelector._canBeUsed();
        try {
            let pictureUrl = usesCamera ? await PictureSelector.getCameraPicture() : await PictureSelector.getLibraryPicture();
            let fileBlob;
            try {
                fileBlob = await PictureSelector.proccesImage(pictureUrl);
                let firebaseStorageManager = new FirebaseStorageManager();
                let downloadUrl = await firebaseStorageManager.uploadFile(fileBlob, fileLocation, fileName);
                return downloadUrl;
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    static getCameraPicture(options = {}) {
        PictureSelector._canBeUsed();
        return new Promise((resolve, reject)=> {
            let options = combineOptions(options, PictureSelector.getDefaultOptions());
            options.sourceType = navigator.camera.PictureSourceType.CAMERA;
            navigator.camera.getPicture(resolve, reject, options);
        });
    }

    static getLibraryPicture(options = {}) {
        PictureSelector._canBeUsed();
        return new Promise((resolve, reject)=> {
            let options = combineOptions(options, PictureSelector.getDefaultOptions());
            options.sourceType = navigator.camera.PictureSourceType.SAVEDPHOTOALBUM;
            navigator.camera.getPicture(resolve, reject, options);
        });
    }

    /**
     *
     * @param localImagePath
     * @returns {Promise} Returns a Promise with a file Blob
     */
    static proccesImage(localImagePath = '') {
        PictureSelector._canBeUsed();

        return new Promise((resolve, reject)=> {
            window.resolveLocalFileSystemURL(localImagePath, (fileEntry)=> {
                fileEntry.file((file)=> {
                    var reader = new FileReader();
                    reader.onloadend = ()=> {
                        var blob = new Blob([new Uint8Array(reader.result)], {type: "image/jpeg"});
                        resolve(blob);
                    };
                    reader.readAsArrayBuffer(file);
                    reader.onerror = reject;
                });
            }, reject);
        });
    }

    static _canBeUsed() {
        if (!navigator || !navigator.camera) {
            throw new Error('Camera Plugin not Defined. PictureSelector class can only be used with a Cordova build and cordova-plugin-camera installed ');
        }

        if (!window.cordova || !window.cordova.file) {
            throw new Error('File Plugin not Defined. PictureSelector class can only be used with a Cordova build and cordova-plugin-file installed ');
        }
    }
}