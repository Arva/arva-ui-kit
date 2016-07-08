import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/circleckeck_rounded_bold.txt';
        
        export class CircleckeckIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }