import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/new_rounded_thin.txt';
        
        export class NewIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }