import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowright2_angular_bold.svg.txt!text';
        
        export class Arrowright2Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }