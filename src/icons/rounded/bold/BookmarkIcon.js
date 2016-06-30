import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/bookmark_rounded_bold.svg';
        
        export class BookmarkIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }