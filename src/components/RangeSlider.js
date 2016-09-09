/**
 * Created by vlad on 01/09/16.
 */

import {layout, event}      from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Knob}               from './Knob.js';
import {Slider}             from './Slider.js';
import {knobSideLength}     from './Slider.js';

const knobPadding = 1;

export class RangeSlider extends Slider {

    _dualKnobOffset = knobSideLength + knobPadding;

    @layout.size(knobSideLength, knobSideLength)
    @layout.origin(0.5, 0.5)
    @layout.align(0, 0.5)
    @layout.translate(0, 0, 20)
    @event.on('mouseup', function() {if (this.snapPointsEnabled) {this._snapSecondKnobOnDrop()}})
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

        this._secondKnobPosition = options.secondKnobPosition;

    }

    _snapKnobOnDrop() {

        this._moveKnobTo(this._closestPointPositionToFirstKnob(this._knobPosition));

    }

    _snapSecondKnobOnDrop() {

        this._moveSecondKnobTo(this._closestPointPositionToSecondKnob(this._secondKnobPosition));

    }

    _onLineTapEnd(event) {

        let clickPosition = event.offsetX;

        if (this._firstKnobCloser(clickPosition)) {
            this._moveKnobTo(
                this.snapPointsEnabled ? this._closestPointPositionToFirstKnob(clickPosition) : this._closestPositionToFirstKnob(clickPosition)
            );
            this._updateSecondKnobRange();
        } else {
            this._moveSecondKnobTo(
                this.snapPointsEnabled ? this._closestPointPositionToSecondKnob(clickPosition) : this._closestPositionToSecondKnob(clickPosition)
            );
            this._updateFirstKnobRange();
        }

    }

    _firstKnobCloser(position) {
        let distanceFromFirstKnob = Math.abs(this._knobPosition - position);
        let distanceFromSecondKnob = Math.abs(this._secondKnobPosition - position);
        return distanceFromFirstKnob <= distanceFromSecondKnob;
    }

    _moveSecondKnobTo(position) {

        this._secondKnobPosition = position;
        this.secondKnob.draggable.setPosition([position, 0], this._curve);

        if (this.options.enableActiveTrail) {
            this._updateActiveTrail();
        }

    }

    _closestPointPositionToFirstKnob(clickPosition) {

        let closestPoint = this._closestPoint(clickPosition);
        let range = this.knob.draggable.options.xRange;

        for (let i = closestPoint; i >= 0; i--) {
            let position = this.snapPointsPositions[i];
            if (position >= range[0] && position <= range[1]) {
                return position;
            }
        }

    }

    _closestPointPositionToSecondKnob(clickPosition) {

        let closestPoint = this._closestPoint(clickPosition);
        let range = this.secondKnob.draggable.options.xRange;

        for (let i = closestPoint; i <= this.snapPoints - 1; i++) {
            let position = this.snapPointsPositions[i];
            if (position >= range[0] && position <= range[1]) {
                return position;
            }
        }

    }

    _closestPositionToFirstKnob(clickPosition) {
        let maxRightPosition = this.knob.draggable.options.xRange[1];
        return clickPosition > maxRightPosition ? maxRightPosition : clickPosition;
    }

    _closestPositionToSecondKnob(clickPosition) {
        let maxLeftPosition = this.secondKnob.draggable.options.xRange[0];
        return clickPosition < maxLeftPosition ? maxLeftPosition : clickPosition;
    }

    _setupListeners() {

        this.once('newSize', ([width]) => {
            this._sliderWidth = width;

            this._dualKnobDraggableSetup();
            this._setKnobInitialPosition();
            this._setSecondKnobInitialPosition();

            if (this.snapPointsEnabled) {
                this._addSnapPoints();
            }

            if (this.options.enableActiveTrail) {
                this._enableActiveTrail();
            }
        });

    }

    _enableActiveTrail() {

        this._addActiveTrailLine();

        this._updateActiveTrail();

        /*Update the active trail size when the first knob is moved.*/
        this.knob.draggable.on('update', () => {

            this._updateActiveTrail();

        });

        /*Update the active trail size when the second knob is moved.*/
        this.secondKnob.draggable.on('update', () => {

            this._updateActiveTrail();

        });

    }

    _updateActiveTrail() {

        if (this.options.enableActiveTrail) {
            this._updateActiveTrailLine();
            if (this.snapPointsEnabled) {
                this._updateActiveTrailSnapPoints();
            }
        }

    }

    _updateActiveTrailLine() {

        this.decorateRenderable('activeTrail',
            layout.size(this._secondKnobPosition - this._knobPosition, 2),
            layout.align(this._knobPosition / this._sliderWidth, 0.5)
        );

    }

    _inActivePosition(position) {
        return position >= this._knobPosition && position <= this._secondKnobPosition;
    }

    _setSecondKnobInitialPosition() {
        this.secondKnob.draggable.setPosition([this._secondKnobPosition, 0]);
    }

    _dualKnobDraggableSetup() {

        /*Set first knob range.*/
        this.decorateRenderable('knob',
            layout.draggable({
                xRange:[0, this._secondKnobPosition - this._dualKnobOffset],
                projection: 'x'})
        );

        /*Set second knob range.*/
        this.decorateRenderable('secondKnob',
            layout.draggable({
                xRange:[this._knobPosition + this._dualKnobOffset, this._sliderWidth],
                projection: 'x'})
        );

        this._updateKnobsOnMovement();

    }

    _updateKnobsOnMovement() {

        /*Update the second knob range when the first knob is moved.*/
        this.knob.draggable.on('update', (event) => {

            this._knobPosition = event.position[0];

            this._updateSecondKnobRange();

        });

        /*Update the first knob range when the second knob is moved.*/
        this.secondKnob.draggable.on('update', (event) => {

            this._secondKnobPosition = event.position[0];

            this._updateFirstKnobRange();

        });

    }

    _updateFirstKnobRange() {
        this.knob.draggable.setOptions({xRange:[0, this._secondKnobPosition - this._dualKnobOffset]});
    }

    _updateSecondKnobRange() {
        this.secondKnob.draggable.setOptions({xRange:[this._knobPosition + this._dualKnobOffset, this._sliderWidth]});
    }
}