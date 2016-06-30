import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/grid_angular_bold.svg';
        
        export class GridIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }