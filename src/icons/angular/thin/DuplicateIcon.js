import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/duplicate_angular_thin.svg.txt!text';
        
        export class DuplicateIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }