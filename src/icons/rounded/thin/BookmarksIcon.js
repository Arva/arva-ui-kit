import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/bookmarks_rounded_thin.svg.txt!text';
        
        export class BookmarksIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }