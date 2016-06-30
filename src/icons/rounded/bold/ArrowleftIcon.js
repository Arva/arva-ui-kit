import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowleft_rounded_bold.svg';
        
        export class ArrowleftIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }