import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/minimize2_rounded_bold.txt';
        
        export class Minimize2Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }