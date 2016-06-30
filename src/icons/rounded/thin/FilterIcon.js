import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/filter_rounded_thin.svg';
        
        export class FilterIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }