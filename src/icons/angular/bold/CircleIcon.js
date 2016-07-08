import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/circle_angular_bold.txt';
        
        export class CircleIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }