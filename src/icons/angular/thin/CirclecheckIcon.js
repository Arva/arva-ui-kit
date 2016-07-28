import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/circlecheck_angular_thin.svg.txt!text';

 export class CirclecheckIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}