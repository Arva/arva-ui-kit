import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/maximize_rounded_bold.svg';
        
        export class MaximizeIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }