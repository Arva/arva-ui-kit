/**
 * Created by vlad on 01/09/16.
 */

import Surface              from 'famous/core/Surface.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Knob}               from './Knob.js';
import {Clickable}          from './Clickable.js';
import {Colors}             from '../defaults/DefaultColors.js';

const knobLeftOffset = -24;
const knobRightOffset = 24;
const lineBorderRadius = '1px';

export class Slider extends Clickable {

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
    firstKnob = new Knob({
        text: this.options.text,
        enableBorder: true,
        enableSoftShadow: true,
        borderRadius: '4px'
    });

    constructor(options = {}) {
        super(combineOptions({
            enableSecondKnob: false
        }, options));

        if (options.enableSecondKnob) {
            this.addRenderable(
                new Knob({
                    text: this.options.text,
                    enableBorder: true,
                    enableSoftShadow: true,
                    borderRadius: '4px'
                }), 'secondKnob',
                layout.size(48, 48),
                layout.stick.right(),
                layout.translate(knobRightOffset, 0, 0)
            )
        }
    }

    _setupListeners() {
        this.once('newSize', ([width]) => {this._setUpKnob(width)});
    }

    _setUpKnob(width) {

        /*Set knob size and horizontal range.*/
        this.decorateRenderable('firstKnob',
            layout.draggable({xRange:[0, width], projection: 'x'})
        );

        if (this.options.enableSecondKnob) {
            this.decorateRenderable('secondKnob',
                layout.draggable({xRange:[-width, 0], projection: 'x'})
            );
        } else {
            /*Fade line color.*/
            this.firstKnob.draggable.on('update', (event) => {
                this.decorateRenderable('selectedLine', layout.opacity(event.position[0] / width));
            });
        }
    }

}