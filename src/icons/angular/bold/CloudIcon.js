import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/cloud_angular_bold.svg';
        
        export class CloudIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }