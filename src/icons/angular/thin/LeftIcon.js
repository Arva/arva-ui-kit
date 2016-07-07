import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/left_angular_thin.txt';
        
        export class LeftIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }