import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/circlecheck_angular_bold.txt';
        
        export class CirclecheckIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }