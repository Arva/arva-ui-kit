import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/cloudup_angular_bold.txt';
        
        export class CloudupIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }