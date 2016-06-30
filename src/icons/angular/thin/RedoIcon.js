import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/redo_angular_thin.svg';
        
        export class RedoIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }