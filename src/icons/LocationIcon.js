import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/location_default.svg.txt!text';

export class LocationIcon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }