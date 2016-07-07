import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/more_angular_bold.txt';
        
        export class MoreIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }