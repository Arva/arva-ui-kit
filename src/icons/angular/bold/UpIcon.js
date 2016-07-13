import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/up_angular_bold.svg.txt!text';
        
        export class UpIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }