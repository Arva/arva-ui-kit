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

    @layout.size(undefined, 2)
    @layout.stick.center()
    line = new Surface({
        properties: {
            borderRadius: lineBorderRadius,
            backgroundColor: 'rgb(170, 170, 170)'
        }
    });

    @layout.size(knobSideLength, knobSideLength)
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

    }

    _enableActiveTrail() {

        this._addActiveTrail();

        this.decorateRenderable('activeTrail',
            layout.size(undefined, 2),
            layout.opacity(this.knobInitialPosition / this._sliderWidth),
            layout.stick.center()
        );

        /*Fade line color when knob is moved.*/
        this.knob.draggable.on('update', (event) => {
            this.knobPosition = this.knobInitialPosition + event.position[0];

            this.decorateRenderable('activeTrail',
                layout.opacity(this.knobPosition / this._sliderWidth)
            );

            this._updateSnapPointsColor()
        });

    }

    _updateSnapPointsColor() {
        if (this.snapPointsEnabled) {
            for (let i = 0; i < this.snapPoints; i++) {
                this.decorateRenderable('colorSnapPoint' + i,
                    layout.opacity(this.knobPosition / this._sliderWidth)
                );
            }
        }
    }

    _addActiveTrail() {

        this.addRenderable(
            new Surface({
                properties: {
                    borderRadius: lineBorderRadius,
                    backgroundColor: Colors.PrimaryUIColor
                }
            }), 'activeTrail',
            layout.stick.center()
        );

    }

    _addSnapPoints() {

        if (this.snapPoints >= 2) {
            let snapPointsDistance = this._sliderWidth / (this.snapPoints - 1);
            this.snapPointsPositions = [];

            for(let i = 0; i < this.snapPoints; i++) {
                this.snapPointsPositions[i] = i * snapPointsDistance;

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

                if (this.options._enableActiveTrail) {
                    this.addRenderable(
                        new Surface({
                            properties: {
                                borderRadius: '50%',
                                backgroundColor: Colors.PrimaryUIColor
                            }
                        }), 'colorSnapPoint' + i,
                        layout.size(8, 8),
                        layout.opacity(this.knobInitialPosition / this._sliderWidth),
                        layout.origin(0.5, 0.5),
                        layout.align(this.snapPointsPositions[i] / this._sliderWidth, 0.5)
                    );
                }
            }
        }

    }

    _setupListeners() {
        this.once('newSize', ([width]) => {
            this._sliderWidth = width;

            this._positionKnob();
            this._knobDraggableSetup();

            if (this.options._enableActiveTrail) {
                this._enableActiveTrail();
            }

            if (this.snapPointsEnabled) {
                this._addSnapPoints();
            }
        });
    }

    _positionKnob() {
        this.decorateRenderable('knob',
            layout.origin(0.5, 0.5),
            layout.align(this.knobInitialPosition / this._sliderWidth, 0.5)
        );
    }

    _knobDraggableSetup() {

        /*Set the knob horizontal range to be the entire Slider width.*/
        let knobMaxLeft = -this.knobInitialPosition;
        let knobMaxRight = this._sliderWidth - this.knobInitialPosition;
        this.decorateRenderable('knob',
            layout.draggable({xRange:[knobMaxLeft, knobMaxRight], projection: 'x'})
        );

    }

}