/**
 * Created by Manuel on 22/09/16.
 */
import bowser                       from 'bowser';
import {Router}                     from 'arva-js/core/Router.js';
import {Injection}                  from 'arva-js/utils/Injection.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {FirebaseFileSource}         from 'arva-js/data/storage/FirebaseFileSource.js';

export class MediaSelector {
    getFileOptions() {
        return {
            mimeType: '',
            defaultPath:'videos/',
            acceptType: '*/*',
        }
    }

    getDefaultOptions() {
        return {
            // Some common settings are 20, 50, and 100
            quality: 50,
            // targetHeight: 944 /* not in the scope, and not fully working when capturing an image */,
            // targetWidth: 500 /* not in the scope, and not fully working when capturing an image */,
            destinationType: navigator.camera.DestinationType.FILE_URI, /* Don't use DATA_URL options, as this causes memory issues */
            sourceType: '', /* Camera.PictureSourceType.CAMERA | Camera.PictureSourceType.SAVEDPHOTOALBUM */
            encodingType: navigator.camera.EncodingType.JPEG,
            mediaType: navigator.camera.MediaType.ALLMEDIA,
            allowEdit: false, /* Causes issues on Android, as editing software can greatly differ between devices, causing unexpected results/crashes */
            correctOrientation: true  //Corrects Android orientation quirks
        }
    };

    async uploadPicture(usesCamera = true, path = null) {
        let defaultPath = this.getFileOptions().defaultPath;
        try {
            try {
                let file;
                if(bowser.mobile || bowser.tablet){
                    let pictureUrl = usesCamera ? await this.getCameraPicture() : await this.getLibraryPicture();
                    file = await this.processImage(pictureUrl);
                } else {
                    file = await this.getFileSelectorPicture();
                }

                let router = Injection.get(Router);

                return await Injection.get(FirebaseFileSource, path || `${defaultPath}${router.getUser().uid}`).push(file);
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
    async fetchPicture(usesCamera = true, fileLocation = undefined, fileName = undefined) {
        this._canBeUsed();
        try {
            let pictureUrl = usesCamera ? await this.getCameraPicture() : await this.getLibraryPicture();
            let fileBlob;
            try {
                fileBlob = await this.proccesImage(pictureUrl);
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

    getCameraPicture(options = {}) {
        this._canBeUsed();
        return new Promise((resolve, reject)=> {
            let options = combineOptions(options, this.getDefaultOptions());
            options.sourceType = navigator.camera.PictureSourceType.CAMERA;
            navigator.camera.getPicture(resolve, reject, options);
        });
    }

    getLibraryPicture(options = {}) {
        this._canBeUsed();
        return new Promise((resolve, reject)=> {
            let options = combineOptions(options, this.getDefaultOptions());
            options.sourceType = navigator.camera.PictureSourceType.SAVEDPHOTOALBUM;
            navigator.camera.getPicture(resolve, reject, options);
        });
    }

    getFileSelectorPicture() {
        let acceptType = this.getFileOptions().acceptType;

        return new Promise((resolve, reject) => {
            let id = 'MediaSelectorFileSelector';
            let input = document.getElementById(id);

            if (input) {
                document.body.removeChild(input);

                input = document.createElement('input');
                input.id = id;
                input.type = 'file';
                input.accept = acceptType;
                input.style.display = 'none';
                document.body.appendChild(input);
            }
            else if (!input) {
                input = document.createElement('input');
                input.id = id;
                input.type = 'file';
                input.accept = acceptType;
                input.style.display = 'none';
                document.body.appendChild(input);
            }

            /* Remove any old listeners */
            input.removeEventListener('change', this.listener);
            input.value = '';
            this.listener = input.addEventListener('change', (event) => {
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
    processImage(localImagePath = '') {
        let mimeType = this.getFileOptions().mimeType;
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(localImagePath, (fileEntry) => {
                fileEntry.file((file) => {
                    let reader = new FileReader();
                    reader.onloadend = function (evt) {
                        resolve(new Blob([evt.target.result], { type: mimeType }));
                    }
                    reader.onerror = function (e) {
                        console.error("Failed file read: " + e.toString());
                    };
                    reader.readAsArrayBuffer(file);
                });
            }, reject);
        });
    }

    _canBeUsed() {
        if (!navigator || !navigator.camera) {
            throw new Error('Camera Plugin not Defined. MediaSelector class can only be used with a Cordova build and cordova-plugin-camera installed ');
        }

        if (!window.cordova || !window.cordova.file) {
            throw new Error('File Plugin not Defined. MediaSelector class can only be used with a Cordova build and cordova-plugin-file installed ');
        }
    }
}