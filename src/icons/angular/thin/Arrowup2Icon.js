import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowup2_angular_thin.txt';
        
        export class Arrowup2Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }