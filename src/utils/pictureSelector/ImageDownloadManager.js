/**
 * Created by Manuel on 15/06/16.
 */
import firebase                     from 'firebase';

export class ImageDownloadManager {
    constructor(){
        this.storage = firebase.storage();
        this.storageRef = this.storage.ref();

        this.imageExtension = ".jpg";
    }

    preFetchFile(fileName){
        return new Promise((resolve, reject)=>{
            this.storageRef.child(`${fileName}${this.imageExtension}`).getDownloadURL().then((url)=>{

                /* Only preFetch images for native OS'es */
                if(window.cordova && window.cordova.file){
                    this.downloadFile(url, `${fileName}${this.imageExtension}`).then((filename)=>{
                        resolve(filename);
                    }).catch((error)=>{
                        reject(error);
                    });
                } else {
                    resolve(url);
                }
            }).catch((error)=>{
                console.log('Error downloading file:' + error);
                reject(error);
            });
        });

    }

    downloadFile(url, name){
        return new Promise((resolve, reject)=>{
            function createFile(fileURL, url){
                var fileTransfer = new FileTransfer();
                var uri = url;
                    fileTransfer.download(
                        uri,
                        fileURL,
                        function(entry) {
                            resolve(entry.toURL());
                        },
                        function(error) {
                            reject(error);
                        },
                        false,
                        {
                            headers: {
                                "Access-Control-Allow-Origin": "*"
                            }
                        }
                    );
            }
            window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {
                createFile(fs.root.nativeURL + name, url);
            }, (error)=>{console.log(error)});
        });
    }
}