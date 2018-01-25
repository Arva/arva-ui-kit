/**
 * Created by Manuel on 06/09/16.
 */

import {combineOptions} from 'arva-js/utils/CombineOptions.js';
import {
    layout, bindings,
    flow, dynamic
} from 'arva-js/layout/Decorators.js'
import {Clickable} from '../components/Clickable.js';
import {UIRegular} from '../text/UIRegular.js';
import Surface from 'famous/core/Surface.js';
import {Colors} from '../defaults/DefaultColors';
import {AccountIcon} from '../icons/AccountIcon';

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

@dynamic(() =>
    bindings.setup({
        active: false,
        textOpacity: 1,
        passiveColor: Colors.Gray,
        activeColor: Colors.PrimaryUIColor,
        properties: {color: 'white'},
        swapColors: false
    })
)
export class Tab extends Clickable {

    @bindings.trigger()
    setTextColor({active, activeColor, passiveColor, swapColors}) {
        this.options.properties.color =
            active ?
                (swapColors ? passiveColor : activeColor) : (swapColors ? activeColor : passiveColor);
    }

    @bindings.trigger()
    decreaseFontSizeForIcon() {
        if(this.options.icon){
            this.options.properties.fontSize = '10px';
        }
    }

    @layout.translate(0, 0, 30)
        .dock.top()
        .size(24, 24)
        .origin(0.5, 0)
        .align(0.5, 0)
    icon = this.options.icon && this.options.icon.with({color: this.options.properties.color});


    @dynamic(({textOpacity}) => flow.transition()(layout.opacity(textOpacity)))
    @layout.translate(0, 0, 30)
        .dock.top()
        .dockSpace(2)
        .size(true, true)
        .origin(0.5, 0)
        .align(0.5, 0)
        /* Options need to be spread here since databinding doesn't work when passing the whole options object */
    text = this.options.content && UIRegular.with({...this.options});

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

    _handleTapRemoved() {
        this._handleTapEnd();
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