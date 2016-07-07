import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/search_rounded_thin.txt';
        
        export class SearchIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }