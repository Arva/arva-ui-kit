import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/circleckeck_rounded_bold.svg.txt!text';

export class CircleckeckIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
 }