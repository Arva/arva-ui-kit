import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/duplicate_angular_thin.txt';
        
        export class DuplicateIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }