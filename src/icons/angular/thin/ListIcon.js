import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/list_angular_thin.txt';
        
        export class ListIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }