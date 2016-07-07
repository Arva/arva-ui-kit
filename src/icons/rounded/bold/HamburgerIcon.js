import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/hamburger_rounded_bold.txt';
        
        export class HamburgerIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }