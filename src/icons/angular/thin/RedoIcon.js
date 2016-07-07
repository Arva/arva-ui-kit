import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/redo_angular_thin.txt';
        
        export class RedoIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }