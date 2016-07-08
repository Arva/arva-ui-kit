import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/circleminus_rounded_bold.txt';
        
        export class CircleminusIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }