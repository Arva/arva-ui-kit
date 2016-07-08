import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/circlecross_rounded_bold.txt';
        
        export class CirclecrossIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }