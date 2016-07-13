import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/left_angular_bold.svg.txt!text';
        
        export class LeftIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }