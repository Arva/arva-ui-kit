/**
 * Created by vlad on 01/09/16.
 */

import Surface              from 'famous/core/Surface.js';
import Easing               from 'famous/transitions/Easing.js';
import {layout, event}      from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Knob}               from './Knob.js';
import {Clickable}          from './Clickable.js';
import {Colors}             from '../defaults/DefaultColors.js';

export const knobSideLength = 48;
const lineBorderRadius = '1px';

export class Slider extends Clickable {

    _curve = {curve: Easing.outBack, duration: 200};

    @layout.fullSize()
    @layout.translate(0, 0, 10)
    @event.on('mouseup', function(event) { this._onLineTapEnd(event); })
    @event.on('touchend', function(event) { this._onLineTapEnd(event); })
    touchArea = new Surface({ properties: { cursor: 'pointer' } });

    @layout.size(undefined, 2)
    @layout.stick.center()
    line = new Surface({
        properties: {
            borderRadius: lineBorderRadius,
            backgroundColor: 'rgb(170, 170, 170)'
        }
    });

    @layout.size(knobSideLength, knobSideLength)
    @layout.origin(0.5, 0.5)
    @layout.align(0, 0.5)
    @layout.translate(0, 0, 20)
    @event.on('mouseup', function() { if (this.snapPointsEnabled) {this._snapKnobOnDrop()} })
    @event.on('touchend', function() { if (this.snapPointsEnabled) {this._snapKnobOnDrop()} })
    knob = new Knob({
        text: this.options.text,
        enableBorder: true,
        enableSoftShadow: true,
        borderRadius: '4px'
    });

    constructor(options = {}) {

        super(combineOptions({
            knobPosition: 0,
            shadowType: 'noShadow',
            enableActiveTrail: true,
            snapPoints: 0,
            icons: [null, null]
        }, options));

        this._knobPosition = options.knobPosition;
        this.snapPoints = options.snapPoints;
        this.snapPointsEnabled = this.snapPoints >= 2;

    }

    _snapKnobOnDrop() {

        this._moveKnobTo(this.snapPointsPositions[this._closestPoint(this._knobPosition)]);

    }

    _onLineTapEnd(event) {

        let tapPosition;
        if (event instanceof MouseEvent) {
            tapPosition = event.offsetX;
        } else {
            tapPosition = event.changedTouches[0].pageX;
        }

        this._moveKnobTo(
            this.snapPointsEnabled ? this.snapPointsPositions[this._closestPoint(tapPosition)] : tapPosition
        );

    }

    _closestPoint(tapPosition) {

        return Math.round(tapPosition / this.snapPointsDistance);

    }

    _moveKnobTo(position) {

        let range = this.knob.draggable.options.xRange;
        if (this._positionInRange(position, range)) {
            this._knobPosition = position;
            this.knob.draggable.setPosition([position, 0], this._curve);

            if (this.options.enableActiveTrail) {
                this._updateActiveTrail();
            }
        }

    }

    _positionInRange(position, range) {

        return position >= range[0] && position <= range[1];

    }

    _setupListeners() {

        this.once('newSize', ([width]) => {
            this._sliderWidth = width;

            this._setUpKnob();
            this._setKnobInitialPosition();

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

        /*Fade line color when knob is moved.*/
        this.knob.draggable.on('update', () => {
            this._updateActiveTrail();
        });

    }

    _addActiveTrailLine() {

        this.addRenderable(
            new Surface({
                properties: {
                    borderRadius: lineBorderRadius,
                    backgroundColor: Colors.PrimaryUIColor
                }
            }), 'activeTrail',
            layout.stick.left()
        );

    }

    _updateActiveTrail() {

        if (this.options.enableActiveTrail) {
            this.decorateRenderable('activeTrail',
                layout.size(this._knobPosition, 2)
            );
            if (this.snapPointsEnabled) {
                this._updateActiveTrailSnapPoints();
            }
        }

    }

    _updateActiveTrailSnapPoints() {

        for (let i = 0; i < this.snapPoints; i++) {
            this.decorateRenderable('colorSnapPoint' + i,
                layout.opacity(this._inActivePosition(this.snapPointsPositions[i]) ? 1 : 0)
            );
        }

    }

    _inActivePosition(position) {

        return position <= this._knobPosition;

    }

    _addSnapPoints() {

        this.snapPointsDistance = this._sliderWidth / (this.snapPoints - 1);
        this.snapPointsPositions = [];

        for(let i = 0; i < this.snapPoints; i++) {
            this.snapPointsPositions[i] = i * this.snapPointsDistance;

            this.addRenderable(
                new Surface({
                    properties: {
                        borderRadius: '50%',
                        backgroundColor: 'rgb(170, 170, 170)'
                    }
                }), 'snapPoint' + i,
                layout.size(8, 8),
                layout.origin(0.5, 0.5),
                layout.align(this.snapPointsPositions[i] / this._sliderWidth, 0.5)
            );

            if (this.options.enableActiveTrail) {
                this._addActiveTrailSnapPoint(i);
            }
        }

    }

    _addActiveTrailSnapPoint(i) {

        this.addRenderable(
            new Surface({
                properties: {
                    borderRadius: '50%',
                    backgroundColor: Colors.PrimaryUIColor
                }
            }), 'colorSnapPoint' + i,
            layout.size(8, 8),
            layout.origin(0.5, 0.5),
            layout.align(this.snapPointsPositions[i] / this._sliderWidth, 0.5)
        );

    }

    _setKnobInitialPosition() {

        this.knob.draggable.setPosition([this._knobPosition, 0]);

    }

    _setUpKnob() {

        /*Set the knob horizontal range to be the entire Slider width.*/
        this.decorateRenderable('knob',
            layout.draggable({xRange:[0, this._sliderWidth], projection: 'x'})
        );

        this.knob.draggable.on('update', (event) => {
            this._knobPosition = event.position[0];
        });

    }

}