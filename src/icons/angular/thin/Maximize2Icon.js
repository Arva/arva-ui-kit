import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/maximize2_angular_thin.svg';
        
        export class Maximize2Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }