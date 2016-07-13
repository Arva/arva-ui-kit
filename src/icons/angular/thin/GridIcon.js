import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/grid_angular_thin.svg.txt!text';
        
        export class GridIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }