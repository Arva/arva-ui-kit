/**
 * Created by tom on 12/09/16.
 */

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {UISmallGrey}        from '../text/UISmallGrey.js';

export class SectionHeader extends View {

    @layout.fullSize()
    text = new UISmallGrey({
        properties: {
            backgroundColor: this.options.colorVariation == 'white' ? 'rgb(255, 255, 255)' : 'rgb(250, 250, 250)',
            borderBottom: this.options.lines ? '1px solid rgba(0, 0, 0, 0.1)' : '',
            borderTop: this.options.lines ? '1px solid rgba(0, 0, 0, 0.1)' : '',
            lineHeight: `${this.options.height}px`,
            textAlign: this.options.textAlign,
            padding: '0px 16px',
            overflow: 'hidden'
        },
        content: this.options.content
    });

    constructor(options = {}) {
        super(combineOptions({
            content: '',
            colorVariation: 'grey',
            textAlign: 'left',
            lines: false,
            height: 32
        }, options));
    }

    getSize() {
        return [undefined, this.options.height];
    }
}    