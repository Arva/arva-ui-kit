import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/right_rounded_bold.svg';
        
        export class RightIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }