import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/trash_rounded_bold.svg.txt!text';
        
        export class TrashIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }