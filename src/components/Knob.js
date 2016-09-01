/**
 * Created by vlad on 31/08/16.
 */

import Surface              from 'famous/core/Surface.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {WhiteBox}           from './WhiteBox.js';
import iconImage		    from './resources/dragLines.svg.txt!text';
import {UIRegular}          from '../defaults/DefaultTypefaces.js';

export class Knob extends WhiteBox {

    @layout.size(24, 24)
    @layout.stick.center()
    @layout.translate(0, 0, 50)
    dragLines = new Surface({
        content: this.options.text ? '' : iconImage
    });

    @layout.size(undefined, ~30)
    @layout.stick.center()
    @layout.translate(0, 0, 50)
    text = new Surface(combineOptions({
        content: this.options.text,
        properties: {
            textAlign: 'center'
        }
    }, UIRegular));

    constructor(options = {}) {
        super(options);

        this.background.setProperties({border: this.options.enableBorder ? '1px inset rgba(0, 0, 0, 0.1)' : ''})
    }
}