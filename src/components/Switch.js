/**
 * Created by vlad on 31/08/16.
 */

import Surface              from 'famous/core/Surface.js';
import Easing               from 'famous/transitions/Easing.js';
import {layout, flow}       from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Knob}               from './Knob.js';
import {Clickable}          from './Clickable.js';
import {DoneIcon}           from '../icons/DoneIcon.js';
import {CrossIcon}          from '../icons/CrossIcon.js';
import {Colors}             from '../defaults/DefaultColors.js';
import {getShadow}          from '../defaults/DefaultShadows.js';

const knobLeftOffset = 2;
const iconSize = [24, 24];
const iconColor = 'rgba(0, 0, 0, 0.1)';
const curve = {curve: Easing.outBack, duration: 200};

export class Switch extends Clickable {

    _knobWidth = 30;
    _knobHorizontalRange = 46;

    static getKnobWidth(variation = 'small') {
        switch (variation) {
            default:
                console.log('Invalid variation selected. Falling back to default settings (small).');
                break;
            case 'small':
                return 30;
            case 'medium':
                return 44;
            case 'large':
                return 250;
        }
    }

    @layout.fullSize()
    @layout.stick.center()
    outerBox = new Surface({
        properties: {
            borderRadius: '4px',
            backgroundColor: 'rgb(170, 170, 170)',
            boxShadow: getShadow({
                inset: true,
                onlyForShadowType: 'hard'
            })
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
            backgroundColor: Colors.PrimaryUIColor,
            boxShadow: getShadow({
                inset: true,
                onlyForShadowType: 'hard'
            })
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
    @layout.translate(knobLeftOffset, 0, 30)
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
            enabled: false,
            variation: 'small',
            shadowType: 'noShadow'
        }, options));

        let variation = this.options.variation;

        // Choose knob width based on variation.
        this._knobWidth = Switch.getKnobWidth(variation);

        // Initialize icons.
        let iconDisplaySetting = {display: variation === 'medium' || variation === 'large' ? 'block' : 'none'};
        this.cross.setProperties(iconDisplaySetting);
        this.tick.setProperties(iconDisplaySetting);

        if (this.options.shadowType === 'hardShadow') {
            this._enableHardShadow();
        }

        this.setRenderableFlowState('selectedOuterBox', 'invisible');

        this.once('newSize', ([width]) => {
            this._setUpKnob(width)
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
        if (this._isOn) {
            this.knob.draggable.setPosition([0, 0], curve);
        } else {
            this.knob.draggable.setPosition([this._knobHorizontalRange, 0], curve);
        }
        this.setRenderableFlowState('selectedOuterBox', this._isOn ? 'invisible' : 'visible');
        this._isOn = !this._isOn;
    }

    _setUpKnob(width) {
        this._knobHorizontalRange = width - this._knobWidth - knobLeftOffset * 2;

        // Set knob size and horizontal range.
        this.decorateRenderable('knob',
            layout.draggable({xRange: [0, this._knobHorizontalRange], projection: 'x'})
        );

        // Fades background color.
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

}