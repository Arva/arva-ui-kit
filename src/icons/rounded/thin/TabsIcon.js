import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/tabs_rounded_thin.txt';
        
        export class TabsIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }