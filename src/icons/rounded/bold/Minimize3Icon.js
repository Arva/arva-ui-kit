import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/minimize3_rounded_bold.svg.txt!text';
        
        export class Minimize3Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }