/**
 * Created by vlad on 14/10/2016.
 */

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {UIRegular}          from '../text/UIRegular.js';
import {UISmallGray}        from '../text/UISmallGray.js';

export class ListElementText extends View {

    @layout.size(~150, ~18)
    @layout.dock.top()
    text = new UIRegular({
        content: this.options.text,
        properties: {
            fontWeight: this.options.bold ? 'bold' : 'normal',
            paddingLeft: '16px',
            cursor: 'pointer'
        }
    });

    constructor(options = {}) {
        super(combineOptions({
            text: 'No text set'
        }, options));

        if (this.options.previewText) {
            this.addRenderable(
                new UISmallGray({
                    content: this.options.text,
                    properties: {
                        paddingLeft: '16px',
                        cursor: 'pointer'
                    }
                }), 'previewText',
                layout.size(~120, ~14),
                layout.dock.top()
            );
        }
    }

}