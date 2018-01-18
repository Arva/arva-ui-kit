/**
 * Created by Manuel on 06/09/16.
 */

import {combineOptions} from 'arva-js/utils/CombineOptions.js';
import {TextButton} from '../buttons/TextButton.js';
import {
    layout, bindings,
    flow, dynamic
} from 'arva-js/layout/Decorators.js'
import {Clickable} from '../components/Clickable.js';
import Surface from 'famous/core/Surface.js';


@bindings.setup({
    active: false
})
/**
 * Base Tab for the TabBar. Class is meant to be extended
 *
 * @example
 * input = new Tab();
 *
 * @param {Object} [options] Construction options
 * @param {Boolean} [options.makeRipple] Whether the tab should have a ripple
 * @param {Boolean} [options.useBackground] Whether the tab should use a background
 * @param {Boolean} [options.useBoxShadow] Whether the tab should use a boxshadow
 */
@bindings.setup({
    active: false,
    textOpacity: 1
})
export class Tab extends Clickable {

    @dynamic(({textOpacity}) => flow.transition()(layout.opacity(textOpacity)))
    @layout.translate(0, 0, 30)
        .dock.top()
        .size(true, undefined)
        .origin(0.5, 0)
        .align(0.5, 0)
        /* Options need to be spread here since databinding doesn't work when passing the whole options object */
    text = Surface.with({...this.options});

    /* If current tab is being pressed, either by mouse or tab */
    _hover = true;


    @bindings.trigger()
    setActive() {
        if (this.options.active) {
            this._setActive();
        } else {
            this._setInactive();
        }
    }

    _handleTapStart() {
        this._hover = true;
        this._inBounds = true;
        this._eventOutput.emit('hoverOn');
    }


    _handleTapEnd() {
        this._eventOutput.emit('hoverOff');

        if (this._hover) {
            return this._setActive();
        }

        this._setInactive();
    }


    _setActive() {

        if (this.options.active) {
            return;
        }

        this.options.active = true;
        this._hover = false;
        this.activate();

    }

    _setInactive() {

        if (!this.options.active) {
            return;
        }

        this.options.active = false;
        this._hover = false;
        this.deactivate && this.deactivate();
    }

    /**
     * Set the state of the Tab renderable to active
     */
    activate() {
        this._eventOutput.emit('activate');
    }

    /**
     * Set the state of the Tab renderable to inactive
     * @private
     */
    deactivate() {
        /* to be inherented */
    }
}