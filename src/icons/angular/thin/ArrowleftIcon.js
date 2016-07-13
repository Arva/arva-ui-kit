import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowleft_angular_thin.svg.txt!text';
        
        export class ArrowleftIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }