import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/iosshare_rounded_thin.svg.txt!text';
        
        export class IosshareIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }