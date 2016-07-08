import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/down_angular_bold.txt';
        
        export class DownIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }