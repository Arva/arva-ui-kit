import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/circle_angular_bold.svg';
        
        export class CircleIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }