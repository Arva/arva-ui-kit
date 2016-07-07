import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/right_rounded_thin.txt';
        
        export class RightIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }