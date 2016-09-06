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

    _dualKnobOffset = knobSideLength + knobPadding;

    @layout.size(knobSideLength, knobSideLength)
    secondKnob = new Knob({
        text: this.options.text,
        enableBorder: true,
        enableSoftShadow: true,
        borderRadius: '4px'
    });

    constructor(options = {}) {
        super(combineOptions({
            secondKnobPosition: 49,
            shadowType: 'noShadow',
            enableActiveTrail: true,
        }, options));

        this.secondKnobInitialPosition = options.secondKnobPosition;
        this.secondKnobPosition = this.secondKnobInitialPosition;

    }

    enableActiveTrail() {

        this._addActiveTrail();

        this.decorateRenderable('activeTrail',
            layout.size(this.secondKnobInitialPosition - this.knobPosition, 2),
            layout.opacity(1),
            layout.origin(0, 0.5),
            layout.align(this.knobPosition / this._sliderWidth, 0.5)
        );

        /*Update the active trail size when the first knob is moved.*/
        this.knob.draggable.on('update', (event) => {

            this.decorateRenderable('activeTrail',
                layout.size(this.secondKnobPosition - this.knobPosition, 2),
                layout.align(this.knobPosition / this._sliderWidth, 0.5)
            );

        });

        /*Update the active trail size when the second knob is moved.*/
        this.secondKnob.draggable.on('update', (event) => {

            this.decorateRenderable('activeTrail',
                layout.size(this.secondKnobPosition - this.knobPosition, 2)
            );

        });

    }

    _setupListeners() {
        this.once('newSize', ([width]) => {
            this._sliderWidth = width;

            this._positionKnob();
            this._positionSecondKnob();
            this._dualKnobDraggableSetup();

            if (this.options._enableActiveTrail) {
                this._enableActiveTrail();
            }

            this._addSnapPoints(this.options.snapPoints);
        });
    }

    _positionSecondKnob() {
        this.decorateRenderable('secondKnob',
            layout.origin(0.5, 0.5),
            layout.align(this.secondKnobInitialPosition / this._sliderWidth, 0.5)
        );
    }

    _dualKnobDraggableSetup() {

        /*Set first knob range.*/
        let firstKnobMaxLeft = -this.knobPosition;
        let firstKnobMaxRight = this.secondKnobPosition - this.knobPosition - this._dualKnobOffset;
        this.decorateRenderable('knob',
            layout.draggable({
                xRange:[firstKnobMaxLeft, firstKnobMaxRight],
                projection: 'x'})
        );

        /*Set second knob range.*/
        let secondKnobMaxLeft = -this.secondKnobPosition + this.knobPosition + this._dualKnobOffset;
        let secondKnobMaxRight = this._sliderWidth - this.secondKnobPosition;
        this.decorateRenderable('secondKnob',
            layout.draggable({
                xRange:[secondKnobMaxLeft, secondKnobMaxRight],
                projection: 'x'})
        );

        let firstKnobDraggable = this.knob.draggable;
        let secondKnobDraggable = this.secondKnob.draggable;

        /*Update the second knob range when the first knob is moved.*/
        firstKnobDraggable.on('update', (event) => {

            this.knobPosition = this.knobInitialPosition + event.position[0];

            secondKnobMaxLeft = -this.secondKnobInitialPosition + this.knobPosition + this._dualKnobOffset;
            secondKnobDraggable.setOptions({xRange:[secondKnobMaxLeft, secondKnobMaxRight]});

            if (this.snapPointsEnabled) {
                for (let i = 0; i < this.snapPoints; i++) {
                    let position = this.snapPointsPositions[i];
                    if (position > this.knobPosition && position < this.secondKnobPosition ) {
                        // TO CONTINUE HERE
                    }
                }
            }

        });

        /*Update the first knob range when the second knob is moved.*/
        secondKnobDraggable.on('update', (event) => {

            this.secondKnobPosition = this.secondKnobInitialPosition + event.position[0];

            firstKnobMaxRight = this.secondKnobPosition - this.knobInitialPosition - this._dualKnobOffset;
            firstKnobDraggable.setOptions({xRange:[firstKnobMaxLeft, firstKnobMaxRight]});

        });

    }

}