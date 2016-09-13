/**
 * Created by vlad on 01/09/16.
 */

import Surface              from 'famous/core/Surface.js';
import Easing               from 'famous/transitions/Easing.js';
import {layout, event}      from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Knob}               from '../components/Knob.js';
import {Clickable}          from '../components/Clickable.js';
import {Colors}             from '../defaults/DefaultColors.js';

export const knobSideLength = 48;
const lineBorderRadius = '1px';

export class Slider extends Clickable {

    _curve = {curve: Easing.outBack, duration: 200};

    @layout.fullSize()
    @layout.translate(0, 0, 10)
    @event.on('click', function(event) { this._onLineTapEnd(event); })
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
    @event.on('mousedown', function() { this._openToolTip() })
    @event.on('touchstart', function() { this._openToolTip() })
    @event.on('click', function() { if (this.snapPointsEnabled) {this._snapKnobOnDrop()} })
    @event.on('touchend', function() { if (this.snapPointsEnabled) {this._snapKnobOnDrop()} })
    @event.on('deploy', function(){
        window.addEventListener('mouseup', this._onMouseUp);
    })
    @event.on('recall', function() {
        window.removeEventListener('mouseup', this._onMouseUp);
    })
    knob = new Knob({
        enableBorder: this.options.knobBorder,
        enableSoftShadow: true,
        borderRadius: '4px'
    });

    constructor(options = {}) {

        super(combineOptions({
            knobBorder: false,
            knobPosition: 0,
            shadowType: 'noShadow',
            enableActiveTrail: true,
            range: [],
            values: [],
            amountSnapPoints: 0,
            icons: [null, null]
        }, options));

        this._knobPosition = this.options.knobPosition;

        this.amountSnapPoints = this.options.values.length || this.options.amountSnapPoints;

        this.snapPointsEnabled = this.options.values.length || this.amountSnapPoints >= 2;

    }

    _openToolTip() {
        // this.reflowRecursively();
        this.decorateRenderable('knob',
            layout.size(knobSideLength, knobSideLength * 2),
            layout.origin(0.5, 0.75),
            layout.translate(0, 0, 100)
        );
    }

    _snapKnobOnDrop() {

        this._moveKnobTo(this.snapPointsPositions[this._closestPoint(this._knobPosition)]);

    }

    _onLineTapEnd(event) {

        let tapPosition;
        if (event instanceof MouseEvent) {
            tapPosition = event.offsetX;
        } else {
            tapPosition = this._elementRelativeLocation(event, this.touchArea).elementX;
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
        if (Slider._positionInRange(position, range)) {
            this._knobPosition = position;
            this.knob.draggable.setPosition([position, 0], this._curve);
            this.knob.text.setContent(Math.round(this._knobPosition / this._sliderWidth * 100) + '%');

            if (this.options.enableActiveTrail) {
                this._updateActiveTrail();
            }
        }

    }

    static _positionInRange(position, range) {

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

        for (let i = 0; i < this.amountSnapPoints; i++) {
            this.decorateRenderable('colorSnapPoint' + i,
                layout.opacity(this._inActivePosition(this.snapPointsPositions[i]) ? 1 : 0)
            );
        }

    }

    _inActivePosition(position) {

        return position <= this._knobPosition;

    }

    _addSnapPoints() {

        this.snapPointsDistance = this._sliderWidth / (this.amountSnapPoints - 1);
        this.snapPointsPositions = [];

        for(let i = 0; i < this.amountSnapPoints; i++) {
            this.snapPointsPositions[i] = i * this.snapPointsDistance;

            this._addSnapPoint(i, 'snapPoint', 'rgb(170, 170, 170)');

            if (this.options.enableActiveTrail) {
                this._addActiveTrailSnapPoint(i);
            }
        }

    }

    _addActiveTrailSnapPoint(index) {

        this._addSnapPoint(index, 'colorSnapPoint', Colors.PrimaryUIColor);

    }

    _addSnapPoint(index, name, color) {
        this.addRenderable(
            new Surface({
                properties: {
                    borderRadius: '50%',
                    backgroundColor: color
                }
            }), name.toString() + index,
            layout.size(8, 8),
            layout.origin(0.5, 0.5),
            layout.align(this.snapPointsPositions[index] / this._sliderWidth, 0.5)
        );
    }

    _setKnobInitialPosition() {

        this.knob.draggable.setPosition([this._knobPosition, 0]);

        this.knob.text.setContent(Math.round(this._knobPosition / this._sliderWidth * 100) + '%');

    }

    _setUpKnob() {

        /*Set the knob horizontal range to be the entire Slider width.*/
        this.decorateRenderable('knob',
            layout.draggable({xRange:[0, this._sliderWidth], projection: 'x'})
        );

        this.knob.draggable.on('update', (event) => {
            this._knobPosition = event.position[0];
            this.knob.text.setContent(Math.round(this._knobPosition / this._sliderWidth * 100) + '%');
        });

    }

    _onMouseUp() {

        if (this.snapPointsEnabled) {
            this._snapKnobOnDrop();
        }

    }
}
