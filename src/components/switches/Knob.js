/**
 * Created by vlad on 31/08/16.
 */

import Surface              from 'famous/core/Surface.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Clickable}          from '../Clickable.js';
import iconImage		    from './resources/dragLines.svg.txt!text';
import {UIRegular}          from '../../defaults/DefaultTypefaces.js';

export class Knob extends Clickable {

    @layout.fullSize()
    background = new Surface({
        properties: {
            borderRadius: '2px',
            backgroundColor: 'rgb(255, 255, 255)'
        }
    });

    @layout.size(24, 24)
    @layout.stick.center()
    @layout.translate(0, 0, 50)
    dragLines = new Surface({
        content: this.options.text ? '' : iconImage
    });

    @layout.size(undefined, ~30)
    @layout.stick.center()
    @layout.translate(0, 0, 50)
    text = new Surface(combineOptions({
        content: this.options.text,
        properties: {
            textAlign: 'center'
        }
    }, UIRegular));



}