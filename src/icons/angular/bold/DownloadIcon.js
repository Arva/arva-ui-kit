import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/download_angular_bold.svg';
        
        export class DownloadIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }