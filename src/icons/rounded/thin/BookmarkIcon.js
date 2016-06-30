import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/bookmark_rounded_thin.svg';
        
        export class BookmarkIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }