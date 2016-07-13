import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/trash_angular_thin.svg.txt!text';
        
        export class TrashIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }