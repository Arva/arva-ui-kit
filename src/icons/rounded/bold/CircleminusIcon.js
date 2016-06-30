import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/circleminus_rounded_bold.svg';
        
        export class CircleminusIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }