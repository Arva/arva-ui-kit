import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/circleplus_rounded_bold.txt';
        
        export class CircleplusIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }