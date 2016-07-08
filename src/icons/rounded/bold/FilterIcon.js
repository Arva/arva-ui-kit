import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/filter_rounded_bold.txt';
        
        export class FilterIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }