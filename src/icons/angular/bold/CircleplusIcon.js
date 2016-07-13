import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/circleplus_angular_bold.svg.txt!text';
        
        export class CircleplusIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }