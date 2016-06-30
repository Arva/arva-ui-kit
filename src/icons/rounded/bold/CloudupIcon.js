import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/cloudup_rounded_bold.svg';
        
        export class CloudupIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }