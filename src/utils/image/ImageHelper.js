/**
 * Created by vlad on 27/01/2017.
 */

/**
 * Static ImageHelper class which contains helper functions for downdloading and converting images
 */
export class ImageHelper {

    /**
     * Retrieves a base64 string from an image url
     * @param url
     * @returns {Promise.<*>}
     */
    static async getBase64ImageFromUrl(url) {
        return ImageHelper.getBase64FromBlob(await ImageHelper.getBlobFromUrl(url));
    }

    /**
     * Parses a image blob to Base64 string
     * @param blob
     * @returns {Promise.<*>}
     */
    static getBase64FromBlob(blob) {
        if (blob) {
            const reader = new FileReader();
            return new Promise((resolve) => {
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    resolve(reader.result);
                };
            });
        } else {
            return Promise.reject('Blob is undefined');
        }
    }

    /**
     * Retrieves an image blob from an url
     * @param url
     * @returns {Promise.<*>}
     */
    static getBlobFromUrl(url) {
        if (url) {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            return new Promise((resolve) => {
                xhr.onload = () => {
                    resolve(xhr.response);
                };
                xhr.open('GET', url);
                xhr.send();
            });
        } else {
            return Promise.reject('Url is undefined');
        }
    }

    /**
     * Retrieves the width and height from a Base64 image string by loading it in DOM Image object
     * @param image
     * @returns {*}
     */
    static getDimensionsFromBase64Image(image) {
        if (image) {
            const img = new Image();
            return new Promise((resolve) => {
                img.onload = () => {
                    resolve([img.width, img.height]);
                };
                img.src = image;
            });
        } else {
            return Promise.reject('Image is undefined');
        }
    }

}
