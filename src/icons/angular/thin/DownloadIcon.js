import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/download_angular_thin.txt';
        
        export class DownloadIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }