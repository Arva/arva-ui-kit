import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowleft_angular_thin.svg';
        
        export class ArrowleftIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }