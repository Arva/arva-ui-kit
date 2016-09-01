/**
 * Created by vlad on 01/09/16.
 */

import Surface              from 'famous/core/Surface.js';
import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Knob}               from './Knob.js';
import {Colors}             from '../defaults/DefaultColors.js';

const knobLeftOffset = -24;
const knobRightOffset = 24;
const lineBorderRadius = '10px';

export class Slider extends View {

    _knobHorizontalRange = 46;

    @layout.size(undefined, 2)
    @layout.stick.center()
    line = new Surface({
        properties: {
            borderRadius: lineBorderRadius,
            backgroundColor: 'rgb(170, 170, 170)'
        }
    });

    @layout.size(undefined, 2)
    @layout.opacity(0)
    @layout.stick.center()
    selectedLine = new Surface({
        properties: {
            borderRadius: lineBorderRadius,
            backgroundColor: Colors.PrimaryUIColor
        }
    });

    @layout.size(48, 48)
    @layout.stick.left()
    @layout.translate(knobLeftOffset, 0, 0)
    knob = new Knob({
        text: this.options.text,
        enableBorder: true,
        enableSoftShadow: true,
        borderRadius: '4px'
    });

    _setupListeners() {
        this.once('newSize', ([width]) => {this._setUpKnob(width)});
    }

    _setUpKnob(width) {
        this._knobHorizontalRange = width - 48;

        // Set knob size and horizontal range.
        this.decorateRenderable('knob',
            layout.draggable({xRange:[0, this._knobHorizontalRange], projection: 'x'})
        );

        // Fades background color.
        this.knob.draggable.on('update', (event) => {
            this.decorateRenderable('selectedLine', layout.opacity(event.position[0] / this._knobHorizontalRange));
        });
    }

}