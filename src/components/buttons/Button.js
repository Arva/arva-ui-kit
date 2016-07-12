/**
 * Created by lundfall on 07/07/16.
 */

import _                    from 'lodash';
import Surface              from 'famous/core/Surface.js';
import {View}               from 'arva-js/core/View.js';

import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {layout, options}    from 'arva-js/layout/decorators.js';
import {Clickable}          from '../Clickable.js'
import {Ripple}             from './Ripple.js';
import AnimationController  from 'famous-flex/AnimationController.js';


@layout.translate(0, 0, 30)
export class Button extends Clickable {
    @layout.fullscreen
    @layout.translate(0, 0, -10)
    background = new Surface({properties: this.options.backgroundProperties});

    @layout.animate({
        showInitially: false,
        animation: AnimationController.Animation.Fade,
        transition:{duration: 75}
    })
    @layout.fullscreen
    pressedIndication = new Surface({
        properties: {
            /*boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.5) inset, 0px 0px 5px rgba(255, 255, 255, 0.5)',*/
            backgroundColor: 'rgb(240, 240, 240)'
        }
    });

    @layout.place('bottom')
    @layout.translate(0, 0, -20)
    @layout.size((size) => size - 16, (size) => size - 8)
    boxShadow = new Surface({
        properties: {
            boxShadow: '0px 0px 8px 6px rgba(0,0,0,0.12)',
            borderRadius: this.options.backgroundProperties.borderRadius
        }
    });



    @layout.fullscreen
    @layout.translate(0, 0, 40)
    clickableOverlay = new Surface();


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
        }

        /* Center text vertically by setting lineheight (better for performance) */
        this.layout.on('layoutstart', ({size}) => {
            let newLineHeight = `${size[1]}px`;
            let {text} = this;
            if (text.getProperties().lineHeight !== newLineHeight) {
                text.setProperties({lineHeight: newLineHeight});
            }
        });

    }

    _handleClick(mouseEvent) {
        super._handleClick(mouseEvent);
        if (this.ripple) {
            this.ripple.show(mouseEvent.offsetX, mouseEvent.offsetY);
        }
    }

    _handleTapStart() {
        this.showRenderable('pressedIndication');
    }

    _handleTapEnd() {
        /* Cancelling animation causes ugly hack:
         * The AnimationController doesn't want to abort the animation without first showing the
         * renderable, therefore we must hack the state a bit
         */
        if(this.renderables.pressedIndication.get()){
            this.renderables.pressedIndication._viewStack[0].state = 1;
        }
        this.hideRenderable('pressedIndication');
    }
}
