/**
 * Created by tom on 16/06/16.
 */

import _                                from 'lodash';
import BkImageSurface                   from 'famous-bkimagesurface/BkImageSurface.js';

export class BaseIcon extends BkImageSurface {
    constructor(options){
        super(_.merge({
            content: this.iconPath || '',
            sizeMode: BkImageSurface.SizeMode.ASPECTFILL,
            positionMode: BkImageSurface.positionMode.CENTER
        }, options));
    }
}