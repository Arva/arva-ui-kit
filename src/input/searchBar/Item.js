/**
 * Created by tom on 09/09/16.
 */

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {UIRegular}          from '../../text/UIRegular.js';

export class Item extends UIRegular {

    constructor(options = {}) {
        super(combineOptions({
            content: '',
            properties: {
                textAlign: 'left',
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
