/**
 * Created by lundfall on 07/07/16.
 */

import Surface              from 'famous/core/Surface.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {Throttler}          from 'arva-js/utils/Throttler.js';

import {Clickable}          from '../components/Clickable.js'
import {Ripple}             from '../components/Ripple.js';
import {ComponentPadding}   from '../defaults/DefaultDimensions.js';
import {getShadow}          from '../defaults/DefaultShadows.js';


/**
 * A general class for a clickable making a ripple and some other useful button-like stuff
 */
@layout.dockPadding(0, ComponentPadding, 0, ComponentPadding)
@layout.translate(0, 0, 30)
export class Button extends Clickable {

    _inBounds = true;

    @layout.fullSize()
    @layout.translate(0, 0, 40)
    overlay = new Surface({
        properties: {
            cursor: this.options.enabled ? 'pointer' : 'inherit',
            borderRadius: this.options.backgroundProperties.borderRadius
        }
    });


    /**
     * @example
     * a = new Button({
     *  makeRipple: false,
     *  useBackground: false,
     *  });
     *
     *
     * @param {Object} options. The options a
     * @param {Boolean} [options.makeRipple] Whether or not the button should make a ripple on press. Defaults to true.
     * @param {Boolean} [options.useBoxShadow] Whether or not the button should use a box shadow. Defaults to true
     * @param {Boolean} [options.autoEnable] If true, automatically enables the button when the deploy event is triggered.
     * Defaults to false
     * @param {Boolean} [options.backgroundProperties] The properties that should be passed to the background, if using one.
     */
    constructor(options) {
        super(combineOptions({
            makeRipple: true,
            useBoxShadow: true,
            useBackground: true,
            autoEnable: false,
            backgroundProperties: {
                borderRadius: '4px',
                backgroundColor: 'white'
            }
        }, options));

        this.throttler = new Throttler(3, false, this, true);

        if (this.options.useBackground || this.options.useBoxShadow) {
            this.addRenderable(new Surface({
                properties: {
                    ...(this.options.useBackground ? this.options.backgroundProperties : {}),
                    boxShadow: this.options.useBoxShadow ? getShadow({color: this.options.backgroundProperties.backgroundColor}) : ''
                }
            }), 'background', layout.fullSize(), layout.translate(0, 0, -10));
        }
        if (this.options.makeRipple) {
            this.addRenderable(new Ripple(this.options.rippleOptions), 'ripple',
                layout.size(undefined, undefined),
                layout.clip(undefined, undefined, {borderRadius: this.options.backgroundProperties.borderRadius}));
        }

        if (this.options.autoEnable) {
            this.overlay.on('deploy', () => {
                /* Automatically enable button when coming into the view*/
                if (!this._enabled) {
                    this.enable();
                }
            });
        }

    }

    _handleClick(mouseEvent) {

        /* TouchEvents are enabled, don't listen for click events as touchend will already fire resulting in double click events */
        if (mouseEvent.forwardedTouchEvent) return;

        super._handleClick(mouseEvent);

    }

    _handleTapStart({x, y}) {
        if (this.options.makeRipple && this._isEnabled()) {
            this._inBounds = true;
            /**
             * Calculate the correct position of the click inside the current renderable (overlay taken for easy calculation, as it's always fullSize).
             * This will not account for rotation/skew/any other transforms except translates so if the Button class is e.d rotated the ripple will not be placed in the correct location
             * @type {ClientRect}
             */
            let boundingBox = this.overlay._currentTarget.getBoundingClientRect();
            this.ripple.show(x - boundingBox.left, y - boundingBox.top);
        }
    }

    _setEnabled(enabled) {
        super._setEnabled(enabled);
        this.overlay.setProperties({
            cursor: enabled ? 'pointer' : 'inherit'
        });
    }

    _handleTouchMove(touchEvent) {
        if (this.options.makeRipple && this._inBounds) {
            this.throttler.add(()=> {
                this._inBounds = this._isInBounds(touchEvent);
                if (!this._inBounds) {
                    this.ripple.hide();
                }
            });
        }
    }

    _onMouseOut() {
        if(this.options.makeRipple){
            this.ripple.hide();
        }
    }

    _handleTapEnd(mouseEvent) {
        if (this.options.makeRipple) {
            this.ripple.hide();
        }
        mouseEvent.type === 'touchend' && this._isInBounds(mouseEvent) && this._handleClick(mouseEvent);
    }

    /**
     * @abstract
     */
    setColor() {

    }

    /**
     * Checks if the current TouchEvent is outside the current target element
     * @param touch
     * @param elemposition
     * @param width
     * @param height
     * @returns {boolean}
     * @private
     */
    _isInBounds(touch) {
        let elemposition = this.overlay._currentTarget.getBoundingClientRect();
        let [width, height] = this.overlay.getSize();

        let touchList = touch.touches.length ? touch.touches : touch.changedTouches;

        var left = elemposition.left,
            right = left + width,
            top = elemposition.top,
            bottom = top + height,
            touchX = touchList[0].pageX,
            touchY = touchList[0].pageY;

        return (touchX > left && touchX < right && touchY > top && touchY < bottom);
    };
}
