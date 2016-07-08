import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/undo_angular_thin.txt';
        
        export class UndoIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }