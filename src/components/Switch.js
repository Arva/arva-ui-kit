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

const knobLeftOffset = 2;
const iconSize = [24, 24];
const iconColor = 'rgba(0, 0, 0, 0.1)';
const curve = {curve: Easing.outBack, duration: 100};

// @flow.viewStates({
//     'enabled': [{selectedOuterBox: 'visible'}],
//     'disabled': [{selectedOuterBox: 'invisible'}]
// })
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
            backgroundColor: 'rgb(170, 170, 170)'
        }
    });

    @layout.fullSize()
    @layout.stick.center()
    @flow.stateStep('visible', curve, layout.opacity(1))
    @flow.stateStep('invisible', curve, layout.opacity(0))
    selectedOuterBox = new Surface({
        properties: {
            borderRadius: '4px',
            backgroundColor: Colors.PrimaryUIColor
        }
    });

    @layout.size(...iconSize)
    @layout.stick.left()
    @layout.translate(12, 0, 0)
    tick = new DoneIcon({color: iconColor});

    @layout.size(...iconSize)
    @layout.stick.right()
    @layout.translate(-12, 0, 0)
    cross = new CrossIcon({color: iconColor});

    @layout.size(function(width) {
        return this.options.variation === 'large' ? width - 50 : this._knobWidth
    }, 44)
    @layout.stick.left()
    @layout.translate(knobLeftOffset, 0, 0)
    knob = new Knob({
        text: this.options.text,
        enableSoftShadow: this.options.shadowType === 'softShadow'
    });

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

        if (this.options.shadowType === 'hardShadow'){
            this._enableHardShadow();
        }

        this.setRenderableFlowState('selectedOuterBox', 'invisible');
    }

    _setupListeners() {
        this.on('touchstart', this._onTouchStart);
        this.on('mousedown', this._onTouchStart);
        this.on('touchend', this._onTouchEnd);
        this.on('mouseup', this._onTouchEnd);
        this.once('newSize', ([width]) => {this._setUpKnob(width)});
    }

    _onTouchStart() {}

    _onTouchEnd() {
        if (this._isOn) {
            this.knob.draggable.setPosition([0,0], curve);
        } else {
            this.knob.draggable.setPosition([this._knobHorizontalRange,0], curve);
        }
        this.setRenderableFlowState('selectedOuterBox', this._isOn ? 'invisible' : 'visible');
        this._isOn = !this._isOn;
    }

    _setUpKnob(width) {
        this._knobHorizontalRange = width - this._knobWidth - knobLeftOffset * 2;

        // Set knob size and horizontal range.
        this.decorateRenderable('knob',
            layout.draggable({xRange:[0, this._knobHorizontalRange], projection: 'x'})
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