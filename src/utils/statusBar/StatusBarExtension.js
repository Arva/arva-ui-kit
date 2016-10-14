/**
 * Created by tom on 24/08/16.
 */

import Color                from 'color';
import Surface              from 'famous/core/Surface.js';
import Context              from 'famous/core/Context.js';
import {View}               from 'arva-js/core/View.js';
import {Injection}          from 'arva-js/utils/Injection.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {Colors}             from '../../defaults/DefaultColors.js';

export class StatusBarExtension extends View {

    isiOS = window && window.device && window.device.platform === 'iOS';

    @layout.size(undefined, 20)
    @layout.translate(0, 0, 500)
    background = new Surface({ properties: {
        display: 'block',
        backgroundColor: this.options.color || Colors.PrimaryUIColor
    }});

    /**
     * A single background surface, 20 pixels tall, that is only shown on iOS if a status bar is enabled. Used from within e.g. top menus.
     * Uses either DefaultColors' PrimaryUIColor, or a supplied color.
     *
     * @param {Object} [options] Options passed onto base View class
     * @param {String} [options.color] Color to use instead of PrimaryUIColor
     */
    constructor(options) {
        super(options);

        if(this.isiOS && window.StatusBar) {
            window.StatusBar.show();
        }

        Injection.get(Context).on('resize', this._onResize);
        this._onResize();
    }

    setColor(color) {
        if(!this.isiOS) { return; }

        let colorDefinition = Color(color);
        this.background.setProperties({ backgroundColor: color });

        /* Set the color of the items on the status bar */
        let method = colorDefinition.light() ? 'styleDefault' : 'styleLightContent';
        if(window.StatusBar && window.StatusBar[method]) { window.StatusBar[method](); }
    }

    getSize() {
        return this.background.decorations.size;
    }

    _onResize() {
        /* In landscape mode on iPad, the status bar is hidden. Hence, we need to subscribe to changes in portrait/landscape modes. */
        if( this.isiOS && window.StatusBar && window.StatusBar.isVisible) {
            /* Only show if not already shown */
            this.background.getProperties().display === 'none' && this._show();
        } else if ( this.background.getProperties().display === 'block' ) {
            this._hide();
        }
    }

    _show() {
        this.background.setProperties({ display: 'block' });
        this.decorateRenderable('background', layout.size(undefined, 20));
    }

    _hide() {
        this.background.setProperties({ display: 'none' });
        this.decorateRenderable('background', layout.size(0, 0));
    }
}    