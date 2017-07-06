import {BaseIcon}					from './views/BaseIcon.js';
import iconImage					from './resources/tabs2_default.svg.txt!text';

export class Tabs2Icon extends BaseIcon {
    constructor(options){
        static icon = iconImage;
    }
 }