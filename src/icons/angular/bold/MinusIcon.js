import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/minus_angular_bold.txt';
        
        export class MinusIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }