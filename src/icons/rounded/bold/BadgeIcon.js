import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/badge_rounded_bold.svg.txt!text';
        
        export class BadgeIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }