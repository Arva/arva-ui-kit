import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/bookmark_rounded_thin.txt';
        
        export class BookmarkIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }