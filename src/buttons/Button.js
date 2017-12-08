/**
 * Created by lundfall on 07/07/16.
 */

import Surface from 'famous/core/Surface.js';
import {Throttler} from 'arva-js/utils/Throttler.js';
import {layout} from 'arva-js/layout/Decorators.js';
import {combineOptions} from 'arva-js/utils/CombineOptions.js';
import {Colors} from 'arva-kit/defaults/DefaultColors.js';

import {Clickable} from '../components/Clickable.js'
import {Ripple} from '../components/Ripple.js';
import {ComponentPadding} from '../defaults/DefaultDimensions.js';
import {getShadow} from '../defaults/DefaultShadows.js';


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
        classes: this.options.backgroundClasses || [],
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
     * @param {Boolean} [options.rounded] use rounded button variation
     */
    constructor(options) {
        super(combineOptions({
            makeRipple: true,
            useBoxShadow: true,
            useBackground: true,
            autoEnable: false,
            rounded: false,
            backgroundProperties: {
                borderRadius: options.rounded ? '24px' : '4px',
                backgroundColor: 'white'
            }
        }, options));

        this.throttler = new Throttler(3, false, this, true);

        if (this.options.useBackground || this.options.useBoxShadow) {
            let {backgroundProperties} = this.options;
            this.addRenderable(new Surface({
                classes: this.options.backgroundClasses || [],
                properties: {
                    boxShadow: this.options.useBoxShadow ? getShadow({color: this.options.backgroundProperties.backgroundColor}) : '',
                    ...(this.options.useBackground ? {
                            border: this.options.enableBorder ? '1px inset rgba(0, 0, 0, 0.1)' : '',
                            ...backgroundProperties
                    } : {})
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

    _handleTapStart({x, y}) {
        if (this.options.makeRipple) {

            /**
             * Calculate the correct position of the click inside the current renderable (overlay taken for easy calculation, as it's always fullSize).
             * This will not account for rotation/skew/any other transforms except translates so if the Button class is e.d rotated the ripple will not be placed in the correct location
             * @type {ClientRect}
             */
            let boundingBox = this.overlay._currentTarget.getBoundingClientRect();
            this._showRipple(x - boundingBox.left, y - boundingBox.top, boundingBox);

        }
        super._handleTapStart({x, y});

    }

    _setEnabled(enabled, changeBackground = true, colorProperties = null) {
        super._setEnabled(enabled);
        this.overlay.setProperties({
            cursor: enabled ? 'pointer' : 'inherit'
        });

        if (changeBackground && this.background) {
            if (colorProperties) {
                this.background.setProperties({
                    backgroundColor: enabled ? colorProperties.activeBackgroundColor : colorProperties.inActiveBackgroundColor
                });
            } else {
                this.background.setProperties({
                    backgroundColor: enabled ? this.options.backgroundProperties.backgroundColor : Colors.Gray
                });
            }
        }
    }

    _handleTapRemoved() {
        if (this.options.makeRipple) {
            this.ripple.hide();
        }
    }

    _handleTapEnd(mouseEvent) {
        if (this.options.makeRipple) {
            this._hideRipple();
        }
    }

    _handleTapRemoved() {
        this._hideRipple();
    }

    /**
     * @abstract
     */
    setColor() {

    }

    _showRipple(x, y) {
        this.ripple.show(x, y);
    }

    _hideRipple() {
        this.ripple.hide();
    }
}
