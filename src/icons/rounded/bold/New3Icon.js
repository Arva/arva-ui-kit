import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/new3_rounded_bold.svg.txt!text';
        
        export class New3Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }