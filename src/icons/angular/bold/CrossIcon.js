import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/cross_angular_bold.svg';
        
        export class CrossIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }