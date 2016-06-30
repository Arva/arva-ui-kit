import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowleft2_angular_bold.svg';
        
        export class Arrowleft2Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }