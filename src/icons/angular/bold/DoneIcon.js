import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/done_angular_bold.txt';
        
        export class DoneIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }