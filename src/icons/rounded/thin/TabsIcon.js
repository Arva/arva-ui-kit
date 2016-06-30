import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/tabs_rounded_thin.svg';
        
        export class TabsIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }