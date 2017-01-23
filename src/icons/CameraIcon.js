import {BaseIcon}					from './views/BaseIcon.js';
import IconImage					from './resources/Camera.svg!text';

export class CameraIcon extends BaseIcon {
    constructor(options){
        super({...options, icon: IconImage});
    }
}