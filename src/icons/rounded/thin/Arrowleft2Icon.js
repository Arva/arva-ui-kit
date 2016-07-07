import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowleft2_rounded_thin.txt';
        
        export class Arrowleft2Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }