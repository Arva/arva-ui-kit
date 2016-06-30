import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/minimize3_angular_bold.svg';
        
        export class Minimize3Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }