import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/clouddown_rounded_thin.txt';
        
        export class ClouddownIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }