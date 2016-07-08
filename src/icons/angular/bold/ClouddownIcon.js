import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/clouddown_angular_bold.txt';
        
        export class ClouddownIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }