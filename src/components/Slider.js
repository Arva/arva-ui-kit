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
    @event.on('mouseup', function(event) { this._onLineTapEnd(event); })
    @layout.translate(0, 0, 10)
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
    // @layout.animate({transition: _curve})
    @layout.translate(0, 0, 20)
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

        this.knobInitialPosition = options.knobPosition;
        this.knobPosition = this.knobInitialPosition;
        this.snapPoints = options.snapPoints;
        this.snapPointsEnabled = this.snapPoints >= 2;

        this._setupFinalSizeListener();

    }

    _onLineTapEnd(event) {

        let clickPosition = event.offsetX;
        if (this.snapPointsEnabled) {
            this.knobPosition = this.snapPointsPositions[Math.round(clickPosition / this.snapPointsDistance)];
        } else {
            this.knobPosition = clickPosition;
        }

        this.knob.draggable.setPosition(
            [-this.knobInitialPosition + this.knobPosition, 0],
            this._curve
        );

        this._updateActiveTrail();

    }

    _setupFinalSizeListener() {
        this.once('newSize', ([width]) => {
            this._sliderWidth = width;

            this._setKnobInitialPosition();
            this._setKnobRange();

            if (this.snapPointsEnabled) {
                this._addSnapPoints();
            }

            if (this.options.enableActiveTrail) {
                this._enableActiveTrail();
            }
        });
    }

    _enableActiveTrail() {

        this._addActiveTrail();

        this._updateActiveTrail();

        /*Fade line color when knob is moved.*/
        this.knob.draggable.on('update', (event) => {
            this.knobPosition = this.knobInitialPosition + event.position[0];

            this._updateActiveTrail();
        });

    }

    _addActiveTrail() {

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
                layout.size(this.knobPosition, 2)
            );
            if (this.snapPointsEnabled) {
                this._updateColorSnapPointsOpacity();
            }
        }

    }

    _addSnapPoints() {

        if (this.snapPoints >= 2) {
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
                    this._addColoredSnapPoint(i);
                }
            }
        }

    }

    _addColoredSnapPoint(i) {
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

    _updateColorSnapPointsOpacity() {
        for (let i = 0; i < this.snapPoints; i++) {
            this.decorateRenderable('colorSnapPoint' + i,
                layout.opacity(this._inActivePosition(this.snapPointsPositions[i]) ? 1 : 0)
            );
        }
    }

    _inActivePosition(position) {
        return position < this.knobPosition;
    }

    _setKnobInitialPosition() {
        this.decorateRenderable('knob',
            layout.origin(0.5, 0.5),
            layout.align(this.knobInitialPosition / this._sliderWidth, 0.5)
        );
    }

    _setKnobRange() {

        /*Set the knob horizontal range to be the entire Slider width.*/
        let knobMaxLeft = -this.knobPosition;
        let knobMaxRight = this._sliderWidth - this.knobPosition;
        this.decorateRenderable('knob',
            layout.draggable({xRange:[knobMaxLeft, knobMaxRight], projection: 'x'})
        );

    }

}