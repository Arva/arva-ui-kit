import {BaseIcon}					from '../../BaseIcon.js';
import iconImage					from '../../resources/location_angular_thin.svg.txt!text';

export class LocationIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}