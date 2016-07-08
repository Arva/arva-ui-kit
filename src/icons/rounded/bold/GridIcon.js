import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/grid_rounded_bold.txt';
        
        export class GridIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }