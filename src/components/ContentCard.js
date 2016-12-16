/**
 * Created by lundfall on 20/10/2016.
 */

import Surface              from 'famous/core/Surface.js';
import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {getShadow}          from '../defaults/DefaultShadows.js';

export class ContentCard extends View {

    @layout.translate(0, 0, -10)
    @layout.fullSize()
    background = new Surface({
        properties: {
            backgroundColor: this.options.backgroundColor,
            borderRadius: '4px',
            boxShadow: getShadow({type: this.options.shadow})
        }
    });
    
    getSize() {
        let wrappedSize = super.getSize();
        return [wrappedSize[0], Math.max(wrappedSize[1], 64)];
    }

    /**
     *
     * @param {String} [options.shadow]. The type of shadow. Can be 'hard', 'soft', or 'none'
     * @param options
     */
    constructor(options = {}) {
        super(combineOptions({
            backgroundColor: 'white'
        }, options));
    }
}