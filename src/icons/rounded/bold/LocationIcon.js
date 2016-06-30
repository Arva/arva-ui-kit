import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/location_rounded_bold.svg';
        
        export class LocationIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }