import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/search_angular_bold.svg';
        
        export class SearchIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }