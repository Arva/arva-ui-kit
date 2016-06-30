import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/hamburger_angular_thin.svg';
        
        export class HamburgerIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }