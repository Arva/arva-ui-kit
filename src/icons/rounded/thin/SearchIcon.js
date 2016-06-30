import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/search_rounded_thin.svg';
        
        export class SearchIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }