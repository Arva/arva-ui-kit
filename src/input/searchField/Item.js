/**
 * Created by tom on 09/09/16.
 */

import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {UIRegular}          from '../../text/UIRegular.js';

export class Item extends UIRegular {

    constructor(options = {}) {
        super(combineOptions({
            content: '',
            properties: {
                textAlign: 'left',
                cursor: 'pointer',
                overflow: 'hidden',
                padding: '0px 16px',
                lineHeight: `${options.height || 48}px`
            }
        }, options));
    }

    getSize() {
        return [undefined, this.options.height || 48];
    }
}
