import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/duplicate2_rounded_bold.svg';
        
        export class Duplicate2Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }