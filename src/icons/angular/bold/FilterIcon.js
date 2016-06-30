import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/filter_angular_bold.svg';
        
        export class FilterIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }