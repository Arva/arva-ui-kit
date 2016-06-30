import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/androidshare_rounded_thin.svg';
        
        export class AndroidshareIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }