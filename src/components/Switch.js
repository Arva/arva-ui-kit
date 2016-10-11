/**
 * Created by vlad on 31/08/16.
 */

import Surface              from 'famous/core/Surface.js';
import Timer                from 'famous/utilities/Timer.js';
import Easing               from 'famous/transitions/Easing.js';
import {layout, flow}       from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Knob}               from '../sliders/Knob.js';
import {Clickable}          from './Clickable.js';
import {DoneIcon}           from '../icons/DoneIcon.js';
import {CrossIcon}          from '../icons/CrossIcon.js';
import {Colors}             from '../defaults/DefaultColors.js';

const knobOffset = 2;
const iconSize = [24, 24];
const iconColor = 'rgba(0, 0, 0, 0.1)';
const curve = {curve: Easing.outBack, duration: 200};

export class Switch extends Clickable {

    static getKnobWidth(variation = 'small') {
        switch (variation) {
            default:
                console.log('Invalid variation selected. Falling back to default settings (small).');
            case 'small':
                return 30;
            case 'medium':
                return 44;
            case 'large':
                return this._switchWidth - this._knobHorizontalRange;
        }
    }

    @layout.fullSize()
    @layout.stick.center()
    @layout.translate(0, 0, 0)
    outerBox = new Surface({
        properties: {
            borderRadius: '4px',
            backgroundColor: this.options.inactiveColor

        }
    });

    @layout.fullSize()
    @layout.stick.center()
    @layout.translate(0, 0, 10)
    @flow.stateStep('visible', curve, layout.opacity(1))
    @flow.stateStep('invisible', curve, layout.opacity(0))
    selectedOuterBox = new Surface({
        properties: {
            borderRadius: '4px',
            backgroundColor: this.options.activeColor
        }
    });

    @layout.size(...iconSize)
    @layout.stick.left()
    @layout.translate(12, 0, 20)
    tick = new DoneIcon({color: iconColor});

    @layout.size(...iconSize)
    @layout.stick.right()
    @layout.translate(-12, 0, 20)
    cross = new CrossIcon({color: iconColor});

    @layout.size(function (width) {
        return this.options.variation === 'large' ? width - 50 : this._knobWidth
    }, 44)
    @layout.stick.left()
    @layout.translate(knobOffset, 0, 30)
    knob = new Knob({
        text: this.options.text,
        enableSoftShadow: this.options.shadowType === 'softShadow'
    });

    /**
     * Switch that be used to enable and disable options
     *
     * @example
     * switch = new Switch({
     *     variation: 'large',
     *     text: 'Activate lights',
     *     shadowType: 'hardShadow'
     * });
     *
     * @param {Object} options Construction options
     * @param {Boolean} [options.enabled] Enable the switch
     * @param {String} [options.variation] The variation of the switch ('small', 'medium', 'large')
     * @param {String} [options.text] The text which will be displayed in the large switch only
     * @param {String} [options.shadowType] The type of shadow to use ('noShadow' [default], 'softShadow', 'hardShadow')
     */
    constructor(options = {}) {

        super(combineOptions({
            activeColor: Colors.PrimaryUIColor,
            inactiveColor: 'rgb(170, 170, 170)',
            enabled: false,
            variation: 'small',
            shadowType: 'noShadow'
        }, options));

        let variation = this.options.variation;

        /*Set the knob range depending on the variation.*/
        this._knobHorizontalRange = variation === 'medium' || variation === 'large' ? 46 : 14;

        /* Initialize icons. */
        let iconDisplaySetting = {display: variation === 'medium' || variation === 'large' ? 'block' : 'none'};
        this.cross.setProperties(iconDisplaySetting);
        this.tick.setProperties(iconDisplaySetting);

        if (this.options.shadowType === 'hardShadow') {
            this._enableHardShadow();
        }

        this.setRenderableFlowState('selectedOuterBox', 'invisible');

        this.once('newSize', ([width]) => {
            this._switchWidth = width;

            /* Choose knob width based on variation. */
            this._knobWidth = Switch.getKnobWidth(variation);

            this._setUpKnob(this._switchWidth);
        });
    }

    getSize() {
        let width;
        switch (this.options.variations){
            case 'large':
                width = undefined;
                break;
            case 'medium':
                width = 94;
                break;
            case 'small':
                width = 48;
                break;
        }
        return [width, 48];
    }

    _onTapEnd() {
        /* Defer this one render tick, since Android Chrome has a bug where the draggable touch event is fired after this tapEnd,
         * causing the toggle to be cancelled. */
        Timer.after(this.toggle, 2);
    }

    toggle() {
        if (this._isOn) {
            this._switchOff();
        } else {
            this._switchOn();
        }
    }

    _switchOn() {
        this.knob.draggable.setPosition([this._knobHorizontalRange, 0], curve);
        this.setRenderableFlowState('selectedOuterBox', 'visible');
        this._isOn = true;
    }

    _switchOff() {
        this.knob.draggable.setPosition([0, 0], curve);
        this.setRenderableFlowState('selectedOuterBox', 'invisible');
        this._isOn = false;
    }

    _setUpKnob(width) {

        /* Set knob size and horizontal range. */
        this.decorateRenderable('knob',
            layout.draggable({xRange: [0, this._knobHorizontalRange], projection: 'x'})
        );

        /* Fades background color. */
        this.knob.draggable.on('update', (event) => {
            this.decorateRenderable('selectedOuterBox', layout.opacity(event.position[0] / this._knobHorizontalRange));
        });
    }

    _enableHardShadow() {
        let hardShadow = {boxShadow: 'inset 0px 2px 0px 0px rgba(0,0,0,0.12)'};
        this.outerBox.setProperties(hardShadow);
        this.selectedOuterBox.setProperties(hardShadow);
        this.knob.background.setProperties({boxShadow: '0px 2px 0px 0px rgba(0,0,0,0.12)'});
    }

    /**
     * Sets the switch in the on position.
     */
    switchOn() {
        this._switchOn();
    }

    /**
     *
     */
    switchOff() {
        this._switchOff();
    }

    /**
     *
     * @returns {boolean}
     */
    isOn() {
        return this._isOn;
    }

}