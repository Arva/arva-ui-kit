import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/search_angular_bold.txt';
        
        export class SearchIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }