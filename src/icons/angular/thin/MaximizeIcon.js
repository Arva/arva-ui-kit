import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/maximize_angular_thin.svg';
        
        export class MaximizeIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }