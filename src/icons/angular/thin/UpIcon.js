import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/up_angular_thin.svg.txt!text';
        
        export class UpIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }