import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/list_rounded_thin.txt';
        
        export class ListIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }