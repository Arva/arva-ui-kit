import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/right_angular_bold.svg';
        
        export class RightIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }