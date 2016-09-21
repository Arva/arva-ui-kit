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
    @layout.translate(0, 0, 40)
    @event.on('click', function (event) {
        this._onLineTapEnd(event);
    })
    touchArea = new Surface({properties: {cursor: 'pointer'}});

    @layout.size(undefined, 2)
    @layout.stick.center()
    @layout.translate(0, 0, 10)
    line = new Surface({
        properties: {
            borderRadius: lineBorderRadius,
            backgroundColor: this.options.inactiveColor
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
        if (this._contentProvided && this.options._onMobile) {
            this._retractTooltip('knob');
        }
    })
    @event.on('mouseup', function(){this._onMouseUp(...arguments)})
    @flow.stateStep('expanded', moveCurve, layout.size(knobSideLength, knobSideLength * 2), layout.origin(0.5, 0.75))
    @flow.stateStep('retracted', retractCurve, layout.size(knobSideLength, knobSideLength), layout.origin(0.5, 0.5))
    knob = new Knob({
        makeRipple: !this.options.enableTooltip || !this.options._onMobile,
        enableBorder: this.options.knobBorder,
        enableSoftShadow: true,
        borderRadius: '4px',
        useThrottler: true,
        typeface: UISmallGrey
    });

    /**
     * Slider that is used for fine-grained selection of values
     *
     * @example
     * slider = new Slider({
     *     knobBorder: true,
     *     amountSnapPoints: 5,
     *     shadowType: 'noShadow',
     *     knobPosition: 0.4,
     *     enableActiveTrail: true,
     *     percent: true,
     *     enableTooltip: true,
     *     showDecimal: false,
     *     range: [50, 150]
     *     textOnlyInTooltip: false
     * });
     *
     * @param {Object} options Construction options
     * @param {Number} [options.knobPosition] Set the initial position of the knob as a percentage of the slider width
     * @param {Boolean} [options.knobBorder] Enable border around knob for visibility on white backgrounds
     * @param {String} [options.shadowType] The type of shadow to use ('noShadow' [default], 'softShadow', 'hardShadow')
     * @param {Boolean} [options.enableActiveTrail] Enable the active trail
     * @param {Boolean} [options.percent] Enabling will show the percentage value on the knob, and exclude all other content set
     * @param {Array} [options.range] The min max value range for the slider values
     * @param {Boolean} [options.range] Choose whether to show one decimal point when a value range is enabled
     * @param {Number} [options.amountSnapPoints] The number of snap points the slider should contain
     * @param {Boolean} [options.enableTooltip] Enables the tooltip in mobile environments when the knob is pressed
     * @param {Boolean} [options.textOnlyInTooltip] When enabled, the text content is shown only in the tooltip
     * @param {Array} [options.icons] Add icons to the left and right of the slider
     */
    constructor(options = {}) {
        let _onMobile = Bowser.mobile || Bowser.tablet;

        super(combineOptions({
            _onMobile,
            activeColor: Colors.PrimaryUIColor,
            inactiveColor: 'rgb(170, 170, 170)',
            knobBorder: false,
            knobPosition: 0.0,
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
        this._contentProvided = this.options.percent === true || this.options.range.length >= 1;
    }

    getSize(){
        return [undefined, 48];
    }


    _setupListeners() {
        this.onceNewSize().then(([width]) => {
            this._sliderWidth = width;
            this._knobPosition = Math.round(this.options.knobPosition * this._sliderWidth);

            this._setUpKnobDraggable();

            if (this._snapPointsEnabled) {
                this._addSnapPoints();
            }

            if (this.options.enableActiveTrail) {
                this._enableActiveTrail();
            }

            this._initializeKnob();

            this.onNewSize(this._onResize);
        });

    }

    _onResize([width]) {
        let oldSliderWidth = this._sliderWidth;
        this._sliderWidth = width;

        let newKnobPosition = this._knobPosition  * this._sliderWidth / oldSliderWidth;
        this._moveKnobTo(newKnobPosition);
        this._updateKnobPositionTo('knob', newKnobPosition);

        this.knob.draggable.setOptions({xRange: [0, this._sliderWidth]});

        this._updateActiveTrail();
    }

    _expandTooltip(knob) {
        this.setRenderableFlowState(knob, 'expanded');

        this.decorateRenderable(knob,
            layout.translate(0, 0, 100)
        );

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

        this.decorateRenderable(knob,
            layout.translate(0, 0, 50)
        );

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
        this._moveKnobTo(this._snapPointPosition(this._closestPoint(this._knobPosition)));
    }

    _onLineTapEnd(event) {
        let tapPosition;
        if (event instanceof MouseEvent) {
            tapPosition = event.offsetX;
        } else {
            tapPosition = this._elementRelativeLocation(event, this.touchArea).elementX;
        }

        this._moveKnobTo(
            this._snapPointsEnabled ? this._snapPointPosition(this._closestPoint(tapPosition)) : tapPosition
        );
    }

    _closestPoint(position) {
        return Math.round((position / this._sliderWidth) * (this.amountSnapPoints - 1));
    }

    _moveKnobTo(position) {
        let range = this.knob.draggable.options.xRange;
        if (Slider._positionInRange(position, range)) {
            this._updateKnobPositionTo('knob', position);
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
                    backgroundColor: this.options.activeColor
                }
            }), 'activeTrail',
            layout.stick.left(),
            layout.translate(0, 0, 20)
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
                layout.opacity(this._inActivePosition(this._snapPointPosition(i)) ? 1 : 0)
            );
        }
    }

    _inActivePosition(position) {
        return position <= this._knobPosition;
    }

    _addSnapPoints() {
        for (let i = 0; i < this.amountSnapPoints; i++) {
            this._addSnapPoint(i, 'snapPoint', this.options.inactiveColor);

            if (this.options.enableActiveTrail) {
                this._addActiveTrailSnapPoint(i);
            }
        }
    }

    _snapPointPosition(index) {
        return index / (this.amountSnapPoints - 1) * this._sliderWidth;
    }

    _addActiveTrailSnapPoint(index) {
        this._addSnapPoint(index, 'colorSnapPoint', this.options.activeColor, 40);
    }

    _addSnapPoint(index, name, color, zIndex = 30) {
        this.addRenderable(
            new Surface({
                properties: {
                    borderRadius: '50%',
                    backgroundColor: color
                }
            }), name.toString() + index,
            layout.size(8, 8),
            layout.origin(0.5, 0.5),
            layout.align(index / (this.amountSnapPoints - 1), 0.5),
            layout.translate(0, 0, zIndex)
        );
    }

    _initializeKnob() {
        this.knob.draggable.setPosition([this._knobPosition, 0]);

        this._setupKnobSnapOnDrop('knob');

        if (this._contentProvided) {
            this._setKnobContent('knob');
            this.knob.decorateRenderable('text',
                layout.opacity(this.options.textOnlyInTooltip ? 0 : 1)
            );
        }

        if (this._snapPointsEnabled) {
            this._snapKnobToPoint();
        }
    }
    
    _setupKnobSnapOnDrop(knob) {
        if(this._snapPointsEnabled){
            this[knob].draggable.on('end', ({position: [endPosition]}) => {
                this._moveKnobTo((this._closestPoint(endPosition) / (this.amountSnapPoints - 1)) * this._sliderWidth);
            });
        }
    }

    _setUpKnobDraggable() {
        /*Set the knob horizontal range to be the entire Slider width.*/
        this.decorateRenderable('knob',
            layout.draggable({xRange: [0, this._sliderWidth], projection: 'x', outsideTouches: false})
        );

        this.knob.draggable.on('update', (event) => {
            this._updateKnobPositionTo('knob', event.position[0]);
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
            this._snapPointPosition(this._closestPoint(knobPosition)) : knobPosition;

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
            this._snapPointPosition(this._closestPoint(knobPosition)) : knobPosition;

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

    _updateKnobPositionTo(knob, position) {
        this['_' + knob + 'Position'] = position;
        this._emitMoveEvent();
    }

    _emitMoveEvent() {
        this._eventOutput.emit('valueChange', this.getKnobContent('knob'));
    }

    /**
     * Get the current position of the slider knob.
     * @returns {number|*}
     */
    getKnobPosition() {
        return this._knobPosition;
    }

    /**
     * Set a new position for the slider knob as a percentage of the width.
     * @param percent
     */
    setKnobPosition(percent) {
        this._moveKnobTo(Math.round(percent * this._sliderWidth));
    }

}
