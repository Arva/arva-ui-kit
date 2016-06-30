import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/list_angular_bold.svg';
        
        export class ListIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }