import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/minus_rounded_bold.svg.txt!text';
        
        export class MinusIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }