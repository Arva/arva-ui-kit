import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/maximize3_angular_thin.svg';
        
        export class Maximize3Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }