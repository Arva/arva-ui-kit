import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/minimize3_rounded_thin.svg.txt!text';
        
        export class Minimize3Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }