import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/filter_angular_thin.svg.txt!text';
        
        export class FilterIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }