import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/hamburger_angular_thin.txt';
        
        export class HamburgerIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }