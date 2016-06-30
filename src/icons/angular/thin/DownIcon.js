import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/down_angular_thin.svg';
        
        export class DownIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }