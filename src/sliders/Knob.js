/**
 * Created by vlad on 31/08/16.
 */

import {Surface}        from 'arva-js/surfaces/Surface.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {WhiteBox}           from './WhiteBox.js';
import iconImage		    from './resources/dragLines.svg.txt!text';
import {UIRegular}          from '../defaults/DefaultTypefaces.js';
import {Throttler}          from 'arva-js/utils/Throttler.js';

export class Knob extends WhiteBox {

    @layout.size(24, 24)
    @layout.stick.center()
    @layout.translate(0, 0, 0)
    dragLines = new Surface({
        content: this.options.text ? '' : iconImage,
        properties: {
            cursor: 'pointer'
        }
    });

    @layout.size(undefined, ~30)
    @layout.stick.center()
    @layout.translate(0, 0, 10)
    text = new Surface(combineOptions({
        content: this.options.text,
        properties: {
            textAlign: 'center',
            cursor: 'pointer'
        }
    }, this.options.typeface || UIRegular));

    constructor(options = {}) {
        super(options);

        let throttleDelay = this.options.useThrottler ? 2 : 0;
        this.throttler = new Throttler(throttleDelay, false, undefined, true);
    }

    setText(content) {
        this.throttler.add(() => {
            this.text.setContent(content);
        });
    }
}