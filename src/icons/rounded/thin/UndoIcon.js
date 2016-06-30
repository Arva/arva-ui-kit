import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/undo_rounded_thin.svg';
        
        export class UndoIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }