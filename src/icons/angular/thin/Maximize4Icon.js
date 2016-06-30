import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/maximize4_angular_thin.svg';
        
        export class Maximize4Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }