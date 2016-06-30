import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/bookmarks_rounded_thin.svg';
        
        export class BookmarksIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }