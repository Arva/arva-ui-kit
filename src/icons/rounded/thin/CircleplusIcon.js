import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/circleplus_rounded_thin.txt';
        
        export class CircleplusIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }