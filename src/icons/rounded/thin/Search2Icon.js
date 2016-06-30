import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/search2_rounded_thin.svg';
        
        export class Search2Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }