import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowright2_angular_thin.svg';
        
        export class Arrowright2Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }