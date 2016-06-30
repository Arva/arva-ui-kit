import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowup2_angular_bold.svg';
        
        export class Arrowup2Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }