import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/androidshare_angular_bold.txt';
        
        export class AndroidshareIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }