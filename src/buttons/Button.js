/**
 * Created by lundfall on 07/07/16.
 */

import {Surface} from 'arva-js/surfaces/Surface.js';
import {Throttler} from 'arva-js/utils/Throttler.js'
import {
    layout, bindings,
    event, dynamic
} from 'arva-js/layout/Decorators.js'
import {combineOptions} from 'arva-js/utils/CombineOptions.js'
import {Colors} from 'arva-kit/defaults/DefaultColors.js'

import {Clickable} from '../components/Clickable.js'
import {Ripple} from '../components/Ripple.js'
import {ComponentPadding} from '../defaults/DefaultDimensions.js'
import {getShadow} from '../defaults/DefaultShadows.js'
import {Dimensions} from '../defaults/DefaultDimensions.js';


/**
 * @example
 * a = new Button({
 *  makeRipple: false,
 *  useBackground: false,
 *  });
 * A general class for a Clickable making a ripple and some other useful button-like stuff
 *
 * @param {Object} options. The options a
 * @param {Boolean} [options.makeRipple] Whether or not the button should make a ripple on press. Defaults to true.
 * @param {Boolean} [options.useBoxShadow] Whether or not the button should use a box shadow. Defaults to true
 * @param {Boolean} [options.autoEnable] If true, automatically enables the button when the deploy event is triggered.
 * Defaults to false
 * @param {Boolean} [options.backgroundProperties] The properties that should be passed to the background, if using one.
 */

@bindings.setup({
    backgroundClasses: [],
    useBackground: true,
    enableBorder: false,
    backgroundProperties: {backgroundColor: 'white', borderRadius: '4px'},
    useBoxShadow: true,
    makeRipple: true,
    rippleOptions: {}
})
@layout.dockPadding(0, Dimensions.ComponentPadding, 0, Dimensions.ComponentPadding)
@layout.translate(0, 0, 30)
export class Button extends Clickable {

    _inBounds = true;

    @event.on('focus', function() {
        this._onFocus();
    })
    @event.on('blur', function() {
        this._onBlur();
    })
    @event.on('deploy', function () {
        /* Automatically enable button when coming into the view*/
        if (this.options.autoEnable) {
            this.options.enabled = true;
        }
    })
    @layout.fullSize()
    @layout.translate(0, 0, 40)
    overlay = Surface.with({
        classes: this.options.backgroundClasses,
        properties: {
            cursor: this.options.enabled ? 'pointer' : 'inherit',
            borderRadius: this.options.backgroundProperties.borderRadius,
            boxShadow: this.options.useBoxShadow ? getShadow({color: this.options.backgroundProperties.backgroundColor}) : ''
        }
    });

    @dynamic(({backgroundProperties}) =>
        //todo the clip decorator isn't applied
        layout.clip(undefined, undefined, {borderRadius: backgroundProperties.borderRadius})
    )
    @layout.size(undefined, undefined)
    ripple = Ripple.with({
        ...this.options.rippleOptions,
        backgroundOptions: {
            classes: this.options.backgroundClasses,
            properties: {
                ...(this.options.useBackground ? {
                    border: this.options.enableBorder ? '1px inset rgba(0, 0, 0, 0.1)' : '',
                    ...this.options.backgroundProperties,
                    backgroundColor: this.options.backgroundProperties.backgroundColor
                } : {})
            }
        }
    });


    _handleTapStart({x, y}) {
        if (this.options.makeRipple) {
            /**
             * Calculate the correct position of the click inside the current renderable (overlay taken for easy calculation, as it's always fullSize).
             * This will not account for rotation/skew/any other transforms except translates so if the Button class is e.d rotated the ripple will not be placed in the correct location
             * @type {ClientRect}
             */
            let boundingBox = this.overlay._currentTarget.getBoundingClientRect()
            this.ripple.show(x - boundingBox.left, y - boundingBox.top)
        }
        super._handleTapStart({x, y})

    }


    _handleTapRemoved() {
        this._hideRipple();
    }

    /**
     * @abstract
     * To be inherited
     * @private
     */
    _onBlur() {

    }

    /**
     * @abstract
     * To be inherited
     * @private
     */
    _onFocus() {

    }

    _handleTapEnd(mouseEvent) {
        if (this.options.makeRipple) {
            this._hideRipple();
        }
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

    getSize() {
        return [super.getSize()[0], Dimensions.ComponentHeight];
    }
}
