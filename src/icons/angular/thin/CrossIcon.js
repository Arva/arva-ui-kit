import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/cross_angular_thin.svg.txt!text';
        
        export class CrossIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }