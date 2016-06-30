import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/circleplus_rounded_bold.svg';
        
        export class CircleplusIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }