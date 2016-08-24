/**
 * Created by tom on 22/08/16.
 */

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {UISmallGrey}        from '../../text/UISmallGrey.js';
import {SearchIcon}         from '../../icons/SearchIcon.js';

const MARGIN = 12;

export class Placeholder extends View {

    @layout.dock.left(16)
    @layout.size(16, 16)
    @layout.stick.left()
    /* Somehow the fontSize is needed, or the icon will be rendered with an offset.. */
    icon = new SearchIcon({ color: 'rgb(170, 170, 170)', properties: {
        fontSize: '16px',
        cursor: 'text'
    } });

    /* TODO: Find a way to add the MARGIN space between two renderables whilst having this text item be docked as true sized. */
    @layout.dock.left(undefined, MARGIN)
    @layout.size(~42, ~16)
    @layout.stick.left()
    text = new UISmallGrey({content: this.options.content, properties: { cursor: 'text' }});

    constructor(options = {}) {
        super(combineOptions({
            content: 'Search'
        }, options));
    }

    showText() {
        this.text.setProperties({ display: 'block' });
    }

    hideText() {
        this.text.setProperties({ display: 'none' });
    }
}