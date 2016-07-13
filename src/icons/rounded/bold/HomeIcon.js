import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/home_rounded_bold.svg.txt!text';
        
        export class HomeIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }