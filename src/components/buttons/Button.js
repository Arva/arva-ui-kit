/**
 * Created by lundfall on 07/07/16.
 */

import _                    from 'lodash';
import Surface              from 'famous/core/Surface.js';
import {View}               from 'arva-js/core/View.js';

import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {layout, options}    from 'arva-js/layout/decorators.js';
import {Clickable}          from './../Clickable.js'
import {Ripple}             from './Ripple.js';

@layout.translate(0, 0, 30)

export class Button extends Clickable {
    @layout.fullscreen
    @layout.translate(0, 0, -10)
    background = new Surface({properties: this.options.backgroundProperties});

    @layout.place('bottom')
    @layout.translate(0, 0, -20)
    @layout.size((size) => size - 16, (size) => size - 8)
    boxShadow = new Surface({
        properties: {
            boxShadow: '0px 0px 8px 6px rgba(0,0,0,0.12)',
            borderRadius: this.options.backgroundProperties.borderRadius
        }
    });

    @layout.size(~300, undefined)
    @layout.translate(0, 0, 30)
    @layout.dock('top')
    text = new Surface(this.options);


    constructor(options) {
        super(combineOptions({
            makeRipple: true,
            properties: {
                '-webkit-touch-callout': 'none', /* iOS Safari */
                '-webkit-user-select': 'none', /* Chrome/Safari/Opera */
                '-khtml-user-select': 'none', /* Konqueror */
                '-moz-user-select': 'none', /* Firefox */
                '-ms-user-select': 'noe', /* Internet Explorer/Edge */
                /* Non-prefixed version, currently
                 not supported by any browser */
                'user-select': 'none',
                fontWeight: 'bold',
                textAlign: 'center',
                color: 'black'
            },
            backgroundProperties: {
                backgroundColor: 'white',
                borderRadius: '4px'
            }
        }, options));
        if (this.options.makeRipple) {
            this.addRenderable(new Ripple(), 'ripple',
                layout.size(undefined, undefined),
                layout.clip(undefined, undefined));
            /* Detect click on ripple as well, otherwise we'll miss some clicks */
            this.ripple.on('click', this._onClick);
        }

    }

    _doTapStart(mouseEvent) {
        if (this.ripple) {
            this.ripple.show(mouseEvent.offsetX, mouseEvent.offsetY);
        }
    }

    _doTapEnd() {
        if (this.ripple) {
            this.ripple.hide();
        }
    }
}
