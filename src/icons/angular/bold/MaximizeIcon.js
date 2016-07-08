import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/maximize_angular_bold.txt';
        
        export class MaximizeIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }