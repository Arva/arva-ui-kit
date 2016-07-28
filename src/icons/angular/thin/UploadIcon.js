import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/upload_angular_thin.svg.txt!text';

 export class UploadIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}