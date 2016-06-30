import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/circlecross_rounded_thin.svg';
        
        export class CirclecrossIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }