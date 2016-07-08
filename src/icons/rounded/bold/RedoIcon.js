import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/redo_rounded_bold.txt';
        
        export class RedoIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }