import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/minimize3_angular_thin.txt';
        
        export class Minimize3Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }