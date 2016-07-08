import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/cloud_angular_bold.txt';
        
        export class CloudIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }