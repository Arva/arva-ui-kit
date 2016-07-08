import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowdown_rounded_bold.txt';
        
        export class ArrowdownIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }