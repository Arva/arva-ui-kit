import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/circleckeck_rounded_bold.svg.txt!text';
        
        export class CircleckeckIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }