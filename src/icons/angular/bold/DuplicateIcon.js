import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/duplicate_angular_bold.svg';
        
        export class DuplicateIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }