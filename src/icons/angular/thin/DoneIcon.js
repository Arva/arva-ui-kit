import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/done_angular_thin.svg';
        
        export class DoneIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }