import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/home_angular_bold.svg';
        
        export class HomeIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }