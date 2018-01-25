/**
 * Created by tom on 12/09/16.
 */

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {UISmallGray}        from '../text/UISmallGray.js';
import {UISmall}            from '../text/UISmall.js';
import {Colors}             from '../defaults/DefaultColors.js';

export class SectionHeader extends View {

    @layout.fullSize()
    text = new (this.options.textVariation === 'gray' ? UISmallGray : UISmall)({
        properties: {
            backgroundColor: this.options.colorVariation == 'white' ? 'rgb(255, 255, 255)' : Colors.VeryLightGray,
            borderBottom: this.options.lines ? '1px solid rgba(0, 0, 0, 0.1)' : '',
            borderTop: this.options.lines ? '1px solid rgba(0, 0, 0, 0.1)' : '',
            lineHeight: `${this.options.height}px`,
            textAlign: this.options.textAlign,
            padding: '0px 16px',
            overflow: 'hidden'
        },
        content: this.options.content
    });

    /**
     * A header component, to be used in e.g. the results of a SearchField.
     *
     * @param {Object} [options] Construction options
     * @param {String} [options.content] The textual content that is shown centered in this component
     * @param {String} [options.colorVariation] Can be either 'gray' or 'white', and determines the background color
     * @param {String} [options.textVariation] Can be either 'black' or 'gray', and determines the typeface color
     * @param {String} [options.lines] When set to true, adds 1px lines to the top and bottom of this component
     * @param {Number} [options.height] When set, uses this height if the component isn't being used in a decorated layout
     *
     */
    constructor(options = {}) {
        super(combineOptions({
            content: '',
            colorVariation: 'gray',
            textAlign: 'left',
            lines: false,
            height: 32
        }, options));
    }

    getSize() {
        return [undefined, this.options.height];
    }
}    