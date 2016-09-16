/**
 * Created by vlad on 01/09/16.
 */

import Bowser                           from 'bowser';
import Surface                          from 'famous/core/Surface.js';
import Easing                           from 'famous/transitions/Easing.js';
import {layout, event, flow}            from 'arva-js/layout/Decorators.js';
import {combineOptions}                 from 'arva-js/utils/CombineOptions.js';
import {Knob}                           from '../components/Knob.js';
import {Clickable}                      from '../components/Clickable.js';
import {Colors}                         from '../defaults/DefaultColors.js';
import {UISmall, UISmallGrey}           from '../defaults/DefaultTypefaces.js';

export const knobSideLength = 48;
export const moveCurve = {curve: Easing.outBack, duration: 200};
export const retractCurve = {curve: Easing.outCubic, duration: 200};

const lineBorderRadius = '1px';

@flow.viewStates({})
export class Slider extends Clickable {

    @layout.fullSize()
    @layout.translate(0, 0, 10)
    @event.on('click', function (event) {
        this._onLineTapEnd(event);
    })
    @event.on('touchend', function (event) {
        this._onLineTapEnd(event);
    })
    touchArea = new Surface({properties: {cursor: 'pointer'}});

    @layout.size(undefined, 2)
    @layout.stick.center()
    @layout.translate(0, 0, 20)
    line = new Surface({
        properties: {
            borderRadius: lineBorderRadius,
            backgroundColor: 'rgb(170, 170, 170)'
        }
    });

    @layout.size(knobSideLength, knobSideLength)
    @layout.origin(0.5, 0.5)
    @layout.align(0, 0.5)
    @layout.translate(0, 0, 50)
    @event.on('touchstart', function () {
        this.knob.text.setOptions(UISmall);
        if (this._contentProvided && this.options._onMobile) {
            this._expandTooltip('knob');
        }
    })
    @event.on('mousedown', function () {
        this.knob.text.setOptions(UISmall);
    })
    @event.on('click', function () {
        this.knob.text.setOptions(UISmallGrey);
        if (this._snapPointsEnabled) {
            this._snapKnobToPoint()
        }
    })
    @event.on('touchend', function () {
        this.knob.text.setOptions(UISmallGrey);
        if (this._contentProvided && this.options._onMobile) {
            this._retractTooltip('knob');
        }
        if (this._snapPointsEnabled) {
            this._snapKnobToPoint()
        }
    })
    @event.on('deploy', function () {
        window.addEventListener('mouseup', this._onMouseUp);
    })
    @event.on('recall', function () {
        window.removeEventListener('mouseup', this._onMouseUp);
    })
    @flow.stateStep('expanded', moveCurve, layout.size(knobSideLength, knobSideLength * 2), layout.origin(0.5, 0.75))
    @flow.stateStep('retracted', retractCurve, layout.size(knobSideLength, knobSideLength), layout.origin(0.5, 0.5))
    knob = new Knob({
        // makeRipple: !this.options.enableTooltip,
        enableBorder: this.options.knobBorder,
        enableSoftShadow: true,
        borderRadius: '4px',
        useThrottler: true,
        typeface: UISmallGrey
    });

    constructor(options = {}) {
        let _onMobile = Bowser.mobile || Bowser.tablet;

        super(combineOptions({
            _onMobile,
            knobBorder: false,
            knobPosition: 0,
            shadowType: 'noShadow',
            enableActiveTrail: true,
            range: [],
            showDecimal: false,
            amountSnapPoints: 0,
            enableTooltip: true,
            textOnlyInTooltip: true,
            icons: [null, null]
        }, options));

        this.amountSnapPoints = this.options.amountSnapPoints;
        this._snapPointsEnabled = this.amountSnapPoints >= 2;
        this._knobPosition = this.options.knobPosition;
        this._contentProvided = this.options.percent === true || this.options.range.length >= 1;
    }

    _setupListeners() {
        this.once('newSize', ([width]) => {
            this._sliderWidth = width;
            this._setUpKnob();

            if (this._snapPointsEnabled) {
                this._addSnapPoints();
            }

            if (this.options.enableActiveTrail) {
                this._enableActiveTrail();
            }

            this._initializeKnob();
        });

    }

    _expandTooltip(knob) {
        this.setRenderableFlowState(knob, 'expanded');

        this[knob].decorateRenderable('text',
            layout.align(0.5, 0.25),
            layout.opacity(1)
        );

        this[knob].decorateRenderable('dragLines',
            layout.align(0.5, 0.75),
            layout.opacity(this.options.textOnlyInTooltip ? 1 : 0)
        );
    }

    _retractTooltip(knob) {
        this.setRenderableFlowState(knob, 'retracted');

        this[knob].decorateRenderable('text',
            layout.align(0.5, 0.5),
            layout.opacity(this.options.textOnlyInTooltip ? 0 : 1)
        );

        this[knob].decorateRenderable('dragLines',
            layout.align(0.5, 0.5),
            layout.opacity(this.options.textOnlyInTooltip ? 1 : 0)
        );
    }

    _snapKnobToPoint() {

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
            this._snapPointsEnabled ? this.snapPointsPositions[this._closestPoint(tapPosition)] : tapPosition
        );

    }

    _closestPoint(position) {

        return Math.round(position / this.snapPointsDistance);

    }

    _moveKnobTo(position) {

        let range = this.knob.draggable.options.xRange;
        if (Slider._positionInRange(position, range)) {
            this._updateKnobPositionTo(position);
            this.knob.draggable.setPosition([position, 0], moveCurve);

            if (this._contentProvided) {
                this._setKnobContent('knob');
            }

            if (this.options.enableActiveTrail) {
                this._updateActiveTrail();
            }
        }

    }

    static _positionInRange(position, range) {

        return position >= range[0] && position <= range[1];

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
            layout.stick.left(),
            layout.translate(0, 0, 30)
        );

    }

    _updateActiveTrail() {

        if (this.options.enableActiveTrail) {
            this.decorateRenderable('activeTrail',
                layout.size(this._knobPosition, 2)
            );
            if (this._snapPointsEnabled) {
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

        for (let i = 0; i < this.amountSnapPoints; i++) {
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
            layout.align(this.snapPointsPositions[index] / this._sliderWidth, 0.5),
            layout.translate(0, 0, 40)
        );
    }

    _initializeKnob() {

        this.knob.draggable.setPosition([this._knobPosition, 0]);

        if (this._contentProvided) {
            this.knob.decorateRenderable('text',
                layout.opacity(this.options.textOnlyInTooltip ? 0 : 1)
            );
        }

        if (this._contentProvided) {
            this._setKnobContent('knob');
        }

        if (this._snapPointsEnabled) {
            this._snapKnobToPoint();
        }

    }

    _setUpKnob() {

        /*Set the knob horizontal range to be the entire Slider width.*/
        this.decorateRenderable('knob',
            layout.draggable({xRange: [0, this._sliderWidth], projection: 'x', outsideTouches: false})
        );

        this.knob.draggable.on('update', (event) => {
            this._updateKnobPositionTo(event.position[0]);
            if (this._contentProvided) {
                this._setKnobContent('knob');
            }
        });

    }

    _onMouseUp() {
        this.knob.text.setOptions(UISmallGrey);
        if (this._snapPointsEnabled) {
            this._snapKnobToPoint();
        }
    }

    _setKnobContent(knob) {


        this[knob].decorateRenderable('dragLines',
            layout.opacity(this.options.textOnlyInTooltip ? 1 : 0)
        );

        let knobPosition = this['_' + knob + 'Position'];

        let position = this._snapPointsEnabled ?
            this.snapPointsPositions[this._closestPoint(knobPosition)] : knobPosition;

        if (this.options.percent) {
            let content = this._getPercentValue(position);
            this[knob].setText(content);
        } else if (this.options.range.length > 1) {
            let min = this.options.range[0];
            let max = this.options.range[1];
            let content = this._getValueInRange(position, min, max);
            this[knob].setText(this.options.showDecimal ? content.toFixed(1) : Math.round(content));
        }


    }

    getKnobContent(knob) {

        let knobPosition = this['_' + knob + 'Position'];

        let position = this._snapPointsEnabled ?
            this.snapPointsPositions[this._closestPoint(knobPosition)] : knobPosition;

        if (this.options.percent) {
            return this._getPercentValue(position);
        } else if (this.options.range.length > 1) {
            let min = this.options.range[0];
            let max = this.options.range[1];
            let content = this._getValueInRange(position, min, max);
            return this.options.showDecimal ? content.toFixed(1) : Math.round(content);
        }

    }

    _getPercentValue(position) {
        return Math.round(position / this._sliderWidth * 100) + '%';
    }

    _getValueInRange(position, min, max) {
        return position / this._sliderWidth * (max - min) + min;
    }

    _updateKnobPositionTo(position) {

        this._knobPosition = position;
        this._eventOutput.emit('valueChange', this.getKnobContent('knob'));

    }
}
