import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/maximize2_rounded_bold.svg';
        
        export class Maximize2Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }