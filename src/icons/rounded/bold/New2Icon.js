import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/new2_rounded_bold.svg';
        
        export class New2Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }