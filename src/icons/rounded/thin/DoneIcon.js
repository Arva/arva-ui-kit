import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/done_rounded_thin.txt';
        
        export class DoneIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }