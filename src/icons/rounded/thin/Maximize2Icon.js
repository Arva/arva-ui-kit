import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/maximize2_rounded_thin.txt';
        
        export class Maximize2Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }