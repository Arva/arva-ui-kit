import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/iosshare_rounded_bold.svg';
        
        export class IosshareIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }