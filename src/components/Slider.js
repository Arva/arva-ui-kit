/**
 * Created by vlad on 01/09/16.
 */

import Surface              from 'famous/core/Surface.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Knob}               from './Knob.js';
import {Clickable}          from './Clickable.js';
import {Colors}             from '../defaults/DefaultColors.js';

export const knobSideLength = 48;
const lineBorderRadius = '1px';

export class Slider extends Clickable {

    _sliderWidth;

    @layout.size(undefined, 2)
    @layout.stick.center()
    line = new Surface({
        properties: {
            borderRadius: lineBorderRadius,
            backgroundColor: 'rgb(170, 170, 170)'
        }
    });

    @layout.size(knobSideLength, knobSideLength)
    @layout.stick.left()
    @layout.translate(-24, 0, 0)
    firstKnob = new Knob({
        text: this.options.text,
        enableBorder: true,
        enableSoftShadow: true,
        borderRadius: '4px'
    });

    constructor(options = {}) {
        super(combineOptions({
            shadowType: 'noShadow',
            enableActiveTrail: true,
            snapPoints: 0,
            icons: [null, null]
        }, options));
    }

    _setupListeners() {
        this.once('newSize', ([width]) => {
            this._sliderWidth = width;
            this._singleKnobSetup();
        });
    }

    _singleKnobSetup() {

        /*Set the first knob horizontal range to the entire Slider width.*/
        this.decorateRenderable('firstKnob',
            layout.draggable({xRange:[0, this._sliderWidth], projection: 'x'})
        );

        if (this.options.enableActiveTrail) {
            this.addActiveTrail();

            /*Fade line color.*/
            this.firstKnob.draggable.on('update', (event) => {
                this.decorateRenderable('activeTrail', layout.opacity(event.position[0] / this._sliderWidth));
            });
        }
    }

    addActiveTrail() {
        this.addRenderable(
            new Surface({
                properties: {
                    borderRadius: lineBorderRadius,
                    backgroundColor: Colors.PrimaryUIColor
                }
            }), 'activeTrail',
            layout.size(undefined, 2),
            layout.opacity(0),
            layout.stick.center()
        )
    }

    _addSnapPoints(amount) {
        // TODO
    }

}