import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/search_rounded_bold.svg.txt!text';
        
        export class SearchIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }