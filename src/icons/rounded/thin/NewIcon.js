import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/new_rounded_thin.svg';
        
        export class NewIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }