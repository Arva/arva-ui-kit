import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/upload_rounded_thin.txt';
        
        export class UploadIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }