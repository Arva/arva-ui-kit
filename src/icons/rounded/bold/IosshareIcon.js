import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/iosshare_rounded_bold.txt';
        
        export class IosshareIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }