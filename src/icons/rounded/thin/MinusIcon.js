import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/minus_rounded_thin.svg';
        
        export class MinusIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }