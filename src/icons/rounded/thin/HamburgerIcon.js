import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/hamburger_rounded_thin.svg.txt!text';
        
        export class HamburgerIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }