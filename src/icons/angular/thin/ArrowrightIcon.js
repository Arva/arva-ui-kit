import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowright_angular_thin.txt';
        
        export class ArrowrightIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }