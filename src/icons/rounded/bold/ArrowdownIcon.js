import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowdown_rounded_bold.svg.txt!text';
        
        export class ArrowdownIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }