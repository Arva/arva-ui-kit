import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/right_angular_bold.txt';
        
        export class RightIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }