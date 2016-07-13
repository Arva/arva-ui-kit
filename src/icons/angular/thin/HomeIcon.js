import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/home_angular_thin.svg.txt!text';
        
        export class HomeIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }