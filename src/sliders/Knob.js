/**
 * Created by vlad on 31/08/16.
 */

import {Surface}        from 'arva-js/surfaces/Surface.js';
import {layout, dynamic}    from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {WhiteBox}           from './WhiteBox.js';
import dragLines		    from './resources/dragLines.svg.txt!text';
import {UIRegular}          from '../text/UIRegular.js';
import {Throttler}          from 'arva-js/utils/Throttler.js';

export class Knob extends WhiteBox {

    @dynamic(({text}) => text ? layout.size(undefined, ~70) : layout.size(24, 24))
    @layout.stick.center()
        .translate(0, 0, 0)
    dragGuide = this.options.text ?
        UIRegular.with({
            content: this.options.text,
            properties: {
                textAlign: 'center',
            }
        }) :
        Surface.with({
        content: dragLines,
        properties: {
            cursor: 'pointer'
        }
    });

}