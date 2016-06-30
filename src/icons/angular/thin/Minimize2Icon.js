import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/minimize2_angular_thin.svg';
        
        export class Minimize2Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }