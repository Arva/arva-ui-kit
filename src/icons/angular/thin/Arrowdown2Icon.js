import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowdown2_angular_thin.txt';
        
        export class Arrowdown2Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }