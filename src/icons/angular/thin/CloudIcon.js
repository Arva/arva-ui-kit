import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/cloud_angular_thin.svg';
        
        export class CloudIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }