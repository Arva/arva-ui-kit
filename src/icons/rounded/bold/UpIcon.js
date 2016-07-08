import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/up_rounded_bold.txt';
        
        export class UpIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }