import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/trash2_angular_thin.txt';
        
        export class Trash2Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }