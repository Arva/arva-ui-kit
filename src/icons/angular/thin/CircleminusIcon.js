import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/circleminus_angular_thin.svg.txt!text';
        
        export class CircleminusIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }