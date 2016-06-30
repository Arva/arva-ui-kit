import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowdown_rounded_thin.svg';
        
        export class ArrowdownIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }