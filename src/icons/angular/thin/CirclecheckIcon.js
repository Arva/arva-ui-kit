import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/circlecheck_angular_thin.txt';
        
        export class CirclecheckIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }