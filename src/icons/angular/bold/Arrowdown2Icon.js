import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowdown2_angular_bold.txt';
        
        export class Arrowdown2Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }