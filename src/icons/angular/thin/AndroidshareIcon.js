import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/androidshare_angular_thin.txt';
        
        export class AndroidshareIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }