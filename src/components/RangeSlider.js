/**
 * Created by vlad on 01/09/16.
 */

import Surface              from 'famous/core/Surface.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Knob}               from './Knob.js';
import {Slider}             from './Slider.js';
import {knobSideLength}     from './Slider.js';

const knobPadding = 1;

export class RangeSlider extends Slider {

    firstKnobInitialPosition = 45;
    secondKnobInitialPosition = 234;
    _dualKnobOffset = knobSideLength + knobPadding;

    @layout.size(knobSideLength, knobSideLength)
    @layout.stick.right()
    @layout.translate(24, 0, 0)
    secondKnob = new Knob({
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
            this._dualKnobSetup();
        });
    }

    _dualKnobSetup() {

        let firstKnobPosition = this.firstKnobInitialPosition;
        let secondKnobPosition = this.secondKnobInitialPosition;

        this.decorateRenderable('firstKnob',
            layout.draggable({
                xRange:[-firstKnobPosition, secondKnobPosition - firstKnobPosition - this._dualKnobOffset],
                projection: 'x'})
        );

        this.decorateRenderable('secondKnob',
            layout.draggable({
                xRange:[secondKnobPosition - firstKnobPosition + this._dualKnobOffset, this._sliderWidth - secondKnobPosition],
                projection: 'x'})
        );

        let firstKnobDraggable = this.firstKnob.draggable;
        let secondKnobDraggable = this.secondKnob.draggable;

        if (this.options.enableActiveTrail) {
            this.addActiveTrail();
            this.decorateRenderable('activeTrail',
                layout.opacity(1),
                layout.stick.left()
            );
        }

        /*Update the second knob range when the first knob is moved.*/
        firstKnobDraggable.on('update', (event) => {

            firstKnobPosition = this.firstKnobInitialPosition + event.position[0];

            let newLimit = -this._sliderWidth + firstKnobPosition + this._dualKnobOffset;
            secondKnobDraggable.setOptions({xRange:[newLimit, 0]});

            this.decorateRenderable('activeTrail',
                layout.size(this.secondKnobInitialPosition - firstKnobPosition, 2),
                layout.align(firstKnobPosition / this._sliderWidth, 0.5)
            );

        });

        /*Update the first knob range when the second knob is moved.*/
        secondKnobDraggable.on('update', (event) => {

            secondKnobPosition = this.secondKnobInitialPosition + event.position[0];

            let newLimit = this._sliderWidth + secondKnobPosition - this._dualKnobOffset;
            firstKnobDraggable.setOptions({xRange:[0, newLimit]});

            this.decorateRenderable('activeTrail',
                layout.size(activeTrailLength, 2)
            );

        });

    }

    _addSnapPoints(amount) {
        // TODO
    }

}