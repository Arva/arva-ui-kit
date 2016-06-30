import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/tabs_rounded_bold.svg';
        
        export class TabsIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }