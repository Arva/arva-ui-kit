import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/undo_rounded_bold.svg.txt!text';
        
        export class UndoIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }