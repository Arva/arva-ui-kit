import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/minimize_angular_thin.txt';
        
        export class MinimizeIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }