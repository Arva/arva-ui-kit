import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowleft_rounded_thin.svg.txt!text';
        
        export class ArrowleftIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }