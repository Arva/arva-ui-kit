import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/search_angular_thin.svg.txt!text';
        
        export class SearchIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }