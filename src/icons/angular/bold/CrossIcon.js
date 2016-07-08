import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/cross_angular_bold.txt';
        
        export class CrossIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }