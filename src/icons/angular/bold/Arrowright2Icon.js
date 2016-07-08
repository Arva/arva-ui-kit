import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/arrowright2_angular_bold.txt';
        
        export class Arrowright2Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }