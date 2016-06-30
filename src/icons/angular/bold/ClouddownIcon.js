import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/clouddown_angular_bold.svg';
        
        export class ClouddownIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }