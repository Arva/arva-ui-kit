import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/cloudup_angular_bold.svg.txt!text';
        
        export class CloudupIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }