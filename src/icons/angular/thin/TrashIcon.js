import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/trash_angular_thin.svg';
        
        export class TrashIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }