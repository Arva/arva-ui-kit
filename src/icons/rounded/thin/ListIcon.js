import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/list_rounded_thin.svg';
        
        export class ListIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }