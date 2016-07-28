import {BaseIcon}					from '../../views/BaseIcon.js';
 import iconImage					from '../../resources/upload_rounded_thin.svg.txt!text';

 export class UploadIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: iconImage});
    }
}