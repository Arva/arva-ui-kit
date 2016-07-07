import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/bookmarks_rounded_bold.txt';
        
        export class BookmarksIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }