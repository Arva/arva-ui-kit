import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/download_angular_thin.svg.txt!text';

 export class DownloadIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}