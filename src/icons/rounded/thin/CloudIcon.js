import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/cloud_rounded_thin.txt';
        
        export class CloudIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }