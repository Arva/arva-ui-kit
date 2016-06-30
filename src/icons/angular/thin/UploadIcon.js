import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/upload_angular_thin.svg';
        
        export class UploadIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }