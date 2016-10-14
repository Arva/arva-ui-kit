/**
 * Created by tom on 22/08/16.
 */

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {UIRegular}          from '../../text/UIRegular.js';
import {SearchIcon}         from '../../icons/SearchIcon.js';

const MARGIN = 12;

export class Placeholder extends View {

    @layout.dock.left()
    @layout.size(16, 16)
    @layout.stick.center()
    /* Somehow the fontSize is needed, or the icon will be rendered with an offset.. */
    icon = new SearchIcon({ color: 'rgb(170, 170, 170)', properties: {
        fontSize: '16px',
        cursor: 'text'
    } });

    @layout.dock.left()
    @layout.size(~54, 18)
    @layout.stick.center()
    @layout.dockSpace(MARGIN)
    /* TODO: figure out what arva-js bug is causing this translation to be necessary. The MARGIN should be all we needed here. */
    @layout.translate(-5, 1, 0)
    text = new UIRegular({content: this.options.content, properties: { cursor: 'text', color: 'rgb(170, 170, 170)' }});

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