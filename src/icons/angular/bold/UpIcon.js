import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/up_angular_bold.svg';
        
        export class UpIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }