import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowright_angular_bold.svg';
        
        export class ArrowrightIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }