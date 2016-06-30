import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/minimize4_rounded_thin.svg';
        
        export class Minimize4Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }