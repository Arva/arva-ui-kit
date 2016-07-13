import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/bookmarks_angular_thin.svg.txt!text';
        
        export class BookmarksIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }