import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/minimize_rounded_thin.txt';
        
        export class MinimizeIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }