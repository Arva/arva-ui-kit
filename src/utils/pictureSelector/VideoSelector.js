/**
 * Created by Manuel on 22/09/16.
 */
import bowser                       from 'bowser';
import {Router}                     from 'arva-js/core/Router.js';
import {Injection}                  from 'arva-js/utils/Injection.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {FirebaseFileSource}         from 'arva-js/data/storage/FirebaseFileSource.js';

export class VideoSelector {

    static getDefaultOptions() {
        return {
            // Some common settings are 20, 50, and 100
            quality: 50,
            // targetHeight: 944 /* not in the scope, and not fully working when capturing an image */,
            // targetWidth: 500 /* not in the scope, and not fully working when capturing an image */,
            destinationType: navigator.camera.DestinationType.FILE_URI, /* Don't use DATA_URL options, as this causes memory issues */
            sourceType: '', /* Camera.PictureSourceType.CAMERA | Camera.PictureSourceType.SAVEDPHOTOALBUM */
            encodingType: navigator.camera.EncodingType.JPEG,
            mediaType: navigator.camera.MediaType.VIDEO,
            allowEdit: false, /* Causes issues on Android, as editing software can greatly differ between devices, causing unexpected results/crashes */
            correctOrientation: true  //Corrects Android orientation quirks
        }
    };

    static async uploadPicture(usesCamera = true, path = null) {
        try {
            try {
                let file;
                if(bowser.mobile || bowser.tablet){
                    let pictureUrl = usesCamera ? await VideoSelector.getCameraPicture() : await VideoSelector.getLibraryPicture();
                    file = await VideoSelector.processImage(pictureUrl);
                } else {
                    file = await VideoSelector.getFileSelectorPicture();
                }

                let router = Injection.get(Router);

                return await Injection.get(FirebaseFileSource, path || `videos/${router.getUser().uid}`).push(file);
            } catch (error) {
                return Promise.reject(error);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Fetch in image from camera/library, and upload the file directly to firebase
     * Returns a firebase download link
     * @param usesCamera
     * @param fileLocation {Optional: fileLocation within firebase}
     * @param fileName {Optional: fileName within firebase}
     * @returns {Promise}
     */
    static async fetchPicture(usesCamera = true, fileLocation = undefined, fileName = undefined) {
        VideoSelector._canBeUsed();
        try {
            let pictureUrl = usesCamera ? await VideoSelector.getCameraPicture() : await VideoSelector.getLibraryPicture();
            let fileBlob;
            try {
                fileBlob = await VideoSelector.proccesImage(pictureUrl);
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
        VideoSelector._canBeUsed();
        return new Promise((resolve, reject)=> {
            let options = combineOptions(options, VideoSelector.getDefaultOptions());
            options.sourceType = navigator.camera.PictureSourceType.CAMERA;
            navigator.camera.getPicture(resolve, reject, options);
        });
    }

    static getLibraryPicture(options = {}) {
        VideoSelector._canBeUsed();
        return new Promise((resolve, reject)=> {
            let options = combineOptions(options, VideoSelector.getDefaultOptions());
            options.sourceType = navigator.camera.PictureSourceType.SAVEDPHOTOALBUM;
            navigator.camera.getPicture(resolve, reject, options);
        });
    }

    static getFileSelectorPicture() {
        return new Promise((resolve, reject) => {
            let id = 'VideoSelectorFileSelector';
            let input = document.getElementById(id);
            if (!input) {
                input = document.createElement('input');
                input.id = id;
                input.type = 'file';
                input.accept = 'video/*';
                input.style.display = 'none';
                document.body.appendChild(input);
            }


            /* Remove any old listeners */
            input.removeEventListener('change', VideoSelector.listener);
            input.value = '';
            VideoSelector.listener = input.addEventListener('change', (event) => {
                let files = event.currentTarget.files;
                resolve(files[0]);

            });

            /* This is a work around needed to detect whether a cancel event occurs.
             */
            input.onclick = () => {
                document.body.onfocus = () => setTimeout(() => {
                    if (input.value.length === 0) {
                        resolve(null)
                    }
                    document.body.onfocus = null;
                }, 100)
            };

            input.click();

        });
    }

    /**
     *
     * @param localImagePath
     * @returns {Promise.File} Returns a Promise that resolves a BLOB
     */
    static processImage(localImagePath = '') {
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(localImagePath, (fileEntry) => {
                fileEntry.file((file) => {
                    let reader = new FileReader();
                    reader.onloadend = function (evt) {
                        resolve(new Blob([evt.target.result], { type: "video/mp4" }));
                    }
                    reader.onerror = function (e) {
                        console.error("Failed file read: " + e.toString());
                    };
                    reader.readAsArrayBuffer(file);
                });
            }, reject);
        });
    }

    static _canBeUsed() {
        if (!navigator || !navigator.camera) {
            throw new Error('Camera Plugin not Defined. VideoSelector class can only be used with a Cordova build and cordova-plugin-camera installed ');
        }

        if (!window.cordova || !window.cordova.file) {
            throw new Error('File Plugin not Defined. VideoSelector class can only be used with a Cordova build and cordova-plugin-file installed ');
        }
    }
}