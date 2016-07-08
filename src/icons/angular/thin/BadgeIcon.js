import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/badge_angular_thin.txt';
        
        export class BadgeIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }