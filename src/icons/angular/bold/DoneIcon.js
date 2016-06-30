import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/done_angular_bold.svg';
        
        export class DoneIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }