import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/new_angular_thin.txt';
        
        export class NewIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }