/**
 * Created by tom on 22/08/16.
 */

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {UISmallGrey}        from '../../text/UISmallGrey.js';
import {SearchIcon}         from '../../icons/SearchIcon.js';

export class Placeholder extends View {

    @layout.dock.left(16)
    @layout.size(16, 16)
    @layout.stick.center()
    @layout.dockPadding(0, 12, 0, 0)
    icon = new SearchIcon({ color: 'rgb(170, 170, 170)' });

    @layout.dock.left()
    @layout.stick.center()
    @layout.size(~50, ~16)
    text = new UISmallGrey({content: this.options.content});

    constructor(options = {}) {
        super(combineOptions({
            content: 'Search'
        }, options));
    }
}