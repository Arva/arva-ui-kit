import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/trash_rounded_bold.svg';
        
        export class TrashIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }