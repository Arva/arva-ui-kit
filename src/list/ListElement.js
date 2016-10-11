/**
 * Created by vlad on 11/10/2016.
 */

import Surface              from 'famous/core/Surface.js';

import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {Button}             from '../buttons/Button.js';
import {UIRegular}          from '../text/UIRegular.js';

export class ListElement extends Button {

    @layout.fullSize()
    background = new Surface({content: this.options.content});

    @layout.size(undefined, 48)
    @layout.dock.left()
    @layout.dockSpace(16)
    @layout.stick.left()
    @layout.translate(0, 0, 0)
    text = new UIRegular({
        content: this.options.text,
        properties: {
            lineHeight: '48px'
        }
    });

    constructor(options = {}) {
        super(combineOptions({
            content: 'none of your damn business..'
        }, options));
    }

}