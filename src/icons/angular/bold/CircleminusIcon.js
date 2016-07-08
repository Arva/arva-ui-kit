import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/circleminus_angular_bold.txt';
        
        export class CircleminusIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }