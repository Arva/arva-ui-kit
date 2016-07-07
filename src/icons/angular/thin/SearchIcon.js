import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/search_angular_thin.txt';
        
        export class SearchIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }