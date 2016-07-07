import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/new_angular_bold.txt';
        
        export class NewIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }