import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/up_angular_bold.txt';
        
        export class UpIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }