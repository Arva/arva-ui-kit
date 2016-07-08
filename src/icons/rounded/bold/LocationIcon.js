import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/location_rounded_bold.txt';
        
        export class LocationIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }