import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/redo_rounded_bold.svg';
        
        export class RedoIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }