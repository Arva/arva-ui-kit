import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/upload_angular_bold.txt';
        
        export class UploadIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }