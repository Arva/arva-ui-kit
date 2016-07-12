import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowleft_rounded_thin.txt!text';
        
        export class ArrowleftIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }