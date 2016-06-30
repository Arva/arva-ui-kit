import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/maximize3_rounded_bold.svg';
        
        export class Maximize3Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }