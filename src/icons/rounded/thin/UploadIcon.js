import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/upload_rounded_thin.svg';
        
        export class UploadIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }