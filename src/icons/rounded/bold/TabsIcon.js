import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/tabs_rounded_bold.txt';
        
        export class TabsIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }