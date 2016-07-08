import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/maximize2_rounded_bold.txt';
        
        export class Maximize2Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }