/**
 * Created by vlad on 01/09/16.
 */

import {layout, event, flow}                from 'arva-js/layout/Decorators.js';
import {combineOptions}                     from 'arva-js/utils/CombineOptions.js';
import {Slider}                             from './Slider.js';
import {knobSideLength}                     from './Slider.js';
import {moveCurve}                          from './Slider.js';
import {retractCurve}                       from './Slider.js';
import {Knob}                               from '../components/Knob.js';
import {UISmall, UISmallGrey}               from '../defaults/DefaultTypefaces.js';


const knobPadding = 1;

@flow.viewStates({})
export class RangeSlider extends Slider {

    _dualKnobOffset = knobSideLength + knobPadding;

    @layout.size(knobSideLength, knobSideLength)
    @layout.origin(0.5, 0.5)
    @layout.align(0, 0.5)
    @layout.translate(0, 0, 50)
    @event.on('touchstart', function () {
        this.secondKnob.text.setOptions(UISmall);
        if (this._contentProvided && this.options._onMobile) {
            this._expandTooltip('secondKnob');
        }
    })
    @event.on('mousedown', function () {
        this.secondKnob.text.setOptions(UISmall);
    })
    @event.on('click', function () {
        this.secondKnob.text.setOptions(UISmallGrey);
        if (this._snapPointsEnabled) {
            this._snapSecondKnobToPoint()
        }
    })
    @event.on('touchend', function () {
        this.secondKnob.text.setOptions(UISmallGrey);
        if (this._contentProvided && this.options._onMobile) {
            this._retractTooltip('secondKnob');
        }
        if (this._snapPointsEnabled) {
            this._snapSecondKnobToPoint()
        }
    })
    @event.on('mouseup', function(){this._onMouseUp(...arguments)})
    @flow.stateStep('expanded', moveCurve, layout.size(knobSideLength, knobSideLength * 2), layout.origin(0.5, 0.75))
    @flow.stateStep('retracted', retractCurve, layout.size(knobSideLength, knobSideLength), layout.origin(0.5, 0.5))
    secondKnob = new Knob({
        makeRipple: !this.options.enableTooltip || !this.options._onMobile,
        enableBorder: this.options.knobBorder,
        enableSoftShadow: true,
        borderRadius: '4px',
        useThrottler: true,
        typeface: this.UISmallGrey
    });

    /**
     * Range Slider that is used for fine-grained selection of a range of values
     *
     * @example
     * rangeSlider = new RangeSlider({
     *     knobBorder: true,
     *     amountSnapPoints: 5,
     *     shadowType: 'noShadow',
     *     knobPosition: 132,
     *     secondKnobPosition: 180,
     *     enableActiveTrail: true,
     *     percent: true,
     *     enableTooltip: true,
     *     showDecimal: false,
     *     range: [50, 150]
     *     textOnlyInTooltip: false
     * });
     *
     * @param {Object} options Construction options
     * @param {Boolean} [options.knobBorder] Enable border around both knobs for visibility on white backgrounds
     * @param {String} [options.shadowType] The type of shadow to use ('noShadow' [default], 'softShadow', 'hardShadow')
     * @param {Boolean} [options.enableActiveTrail] Enable the active trail
     * @param {Boolean} [options.percent] Enabling will show the percentage value on the knobs, and exclude all other content set
     * @param {Array} [options.range] The min max value range for the slider values
     * @param {Boolean} [options.range] Choose whether to show one decimal point when a value range is enabled
     * @param {Number} [options.amountSnapPoints] The number of snap points the slider should contain
     * @param {Boolean} [options.enableTooltip] Enables the tooltip in mobile environments when one of the knobs is pressed
     * @param {Boolean} [options.textOnlyInTooltip] When enabled, the text content is shown only in the tooltip
     * @param {Array} [options.icons] Add icons to the left and right of the slider
     */
    constructor(options = {}) {

        super(combineOptions({
            knobBorder: false,
            secondKnobPosition: 0,
            shadowType: 'noShadow',
            enableTooltip: true,
            textOnlyInTooltip: true,
            enableActiveTrail: true,
        }, options));

        this._secondKnobPosition = options.secondKnobPosition;

    }

    _setupListeners() {

        this.once('newSize', ([width]) => {
            this._sliderWidth = width;

            this._dualKnobDraggableSetup();

            if (this._snapPointsEnabled) {
                this._addSnapPoints();
            }

            if (this.options.enableActiveTrail) {
                this._enableActiveTrail();
            }

            this._initializeKnob();
            this._initializeSecondKnob();
        });

    }

    _snapKnobToPoint() {

        this._moveKnobTo(this._closestPointPositionToFirstKnob(this._knobPosition));

    }

    _snapSecondKnobToPoint() {

        this._moveSecondKnobTo(this._closestPointPositionToSecondKnob(this._secondKnobPosition));

    }

    _onLineTapEnd(event) {

        let tapPosition;
        if (event instanceof MouseEvent) {
            tapPosition = event.offsetX;
        } else {
            tapPosition = this._elementRelativeLocation(event, this.touchArea).elementX;
        }

        if (this._firstKnobCloser(tapPosition)) {
            this._moveKnobTo(
                this._snapPointsEnabled ? this._closestPointPositionToFirstKnob(tapPosition) : this._closestPositionToFirstKnob(tapPosition)
            );
            this._updateSecondKnobRange();
        } else {
            this._moveSecondKnobTo(
                this._snapPointsEnabled ? this._closestPointPositionToSecondKnob(tapPosition) : this._closestPositionToSecondKnob(tapPosition)
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

        let range = this.secondKnob.draggable.options.xRange;
        if (Slider._positionInRange(position, range)) {
            this._updateKnobPositionTo('secondKnob', position);
            this.secondKnob.draggable.setPosition([position, 0], moveCurve);

            if (this._contentProvided) {
                this._setKnobContent('secondKnob');
            }

            if (this.options.enableActiveTrail) {
                this._updateActiveTrail();
            }
        }

    }

    _closestPointPositionToFirstKnob(tapPosition) {

        let closestPoint = this._closestPoint(tapPosition);
        let range = this.knob.draggable.options.xRange;

        for (let i = closestPoint; i >= 0; i--) {
            let position = this.snapPointsPositions[i];
            if (Slider._positionInRange(position, range)) {
                return position;
            }
        }

    }

    _closestPointPositionToSecondKnob(tapPosition) {

        let closestPoint = this._closestPoint(tapPosition);
        let range = this.secondKnob.draggable.options.xRange;

        for (let i = closestPoint; i <= this.amountSnapPoints - 1; i++) {
            let position = this.snapPointsPositions[i];
            if (Slider._positionInRange(position, range)) {
                return position;
            }
        }

    }

    _closestPositionToFirstKnob(tapPosition) {
        let maxRightPosition = this.knob.draggable.options.xRange[1];
        return tapPosition > maxRightPosition ? maxRightPosition : tapPosition;
    }

    _closestPositionToSecondKnob(tapPosition) {
        let maxLeftPosition = this.secondKnob.draggable.options.xRange[0];
        return tapPosition < maxLeftPosition ? maxLeftPosition : tapPosition;
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
            if (this._snapPointsEnabled) {
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

    _initializeSecondKnob() {

        this.secondKnob.draggable.setPosition([this._secondKnobPosition, 0]);

        this.secondKnob.decorateRenderable('text',
            layout.opacity(this.options.textOnlyInTooltip ? 0 : 1)
        );

        if (this._contentProvided) {
            this._setKnobContent('secondKnob');
        }

        if (this._snapPointsEnabled) {
            this._snapSecondKnobToPoint();
        }

    }

    _dualKnobDraggableSetup() {

        /*Set first knob range.*/
        this.decorateRenderable('knob',
            layout.draggable({
                xRange: [0, this._secondKnobPosition - this._dualKnobOffset],
                outsideTouches: false,
                projection: 'x'
            })
        );

        /*Set second knob range.*/
        this.decorateRenderable('secondKnob',
            layout.draggable({
                xRange: [this._knobPosition + this._dualKnobOffset, this._sliderWidth],
                outsideTouches: false,
                projection: 'x'
            })
        );

        this._updateKnobsOnMovement();

    }

    _updateKnobsOnMovement() {

        /*Update the second knob range when the first knob is moved.*/
        this.knob.draggable.on('update', (event) => {

            this._updateKnobPositionTo('knob', event.position[0]);

            if (this._contentProvided) {
                this._setKnobContent('knob');
            }

            this._updateSecondKnobRange();

        });

        /*Update the first knob range when the second knob is moved.*/
        this.secondKnob.draggable.on('update', (event) => {

            this._updateKnobPositionTo('secondKnob', event.position[0]);

            if (this._contentProvided) {
                this._setKnobContent('secondKnob');
            }

            this._updateFirstKnobRange();

        });

    }

    _updateFirstKnobRange() {
        this.knob.draggable.setOptions({xRange: [0, this._secondKnobPosition - this._dualKnobOffset]});
    }

    _updateSecondKnobRange() {
        this.secondKnob.draggable.setOptions({xRange: [this._knobPosition + this._dualKnobOffset, this._sliderWidth]});
    }

    _onMouseUp() {
        this.secondKnob.text.setOptions(UISmallGrey);
        if (this._snapPointsEnabled) {
            this._snapSecondKnobToPoint();
        }
    }

    _updateKnobPositionTo(knob, position) {

        this['_' + knob + 'Position'] = position;
        this._eventOutput.emit('valueChange', [this.getKnobContent('knob'), this.getKnobContent('secondKnob')]);

    }
}