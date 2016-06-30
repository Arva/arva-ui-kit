import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/right_angular_thin.svg';
        
        export class RightIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }