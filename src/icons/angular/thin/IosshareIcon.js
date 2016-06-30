import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/iosshare_angular_thin.svg';
        
        export class IosshareIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }