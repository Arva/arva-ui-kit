/**
 * Created by vlad on 31/08/16.
 */

import Surface              from 'famous/core/Surface.js';
import Easing               from 'famous/transitions/Easing.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Knob}               from './Knob.js';
import {Clickable}          from '../Clickable.js';
import {DoneIcon}           from '../../icons/DoneIcon.js';
import {CrossIcon}          from '../../icons/CrossIcon.js';
import {Colors}             from '../../defaults/DefaultColors.js';

export const knobLeftOffset = 2;
export const knobRightOffset = -2;

const iconSize = [24, 24];
const iconColor = 'rgba(0, 0, 0, 0.1)';

export class Switch extends Clickable {

    _isOn = false;

    static getKnobWidth(variation = 'small') {
        switch (variation) {
            default:
                console.log('Invalid variation selected. Falling back to default settings (small).');
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
    @layout.opacity(0.001)
    @layout.stick.center()
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

    @layout.draggable({xRange:[0,46], projection: 'x'})
    @layout.size(30, 44)
    @layout.stick.left()
    @layout.translate(knobLeftOffset, 0, 0)
    knob = new Knob({text: this.options.text});

    _setupListeners() {
        this.on('touchstart', this._onTouchStart);
        this.on('mousedown', this._onTouchStart);
        this.on('touchend', this._onTouchEnd);
        this.on('mouseup', this._onTouchEnd);
    }

    constructor(options = {}) {
        super(combineOptions({
            variation: 'small',
            shadowType: 'noShadow'
        }, options));

        let variation = options.variation;

        // Initialize icons.
        let displaySetting = {display: variation === 'medium' || variation === 'large' ? 'block' : 'none'};
        this.cross.setProperties(displaySetting);
        this.tick.setProperties(displaySetting);

        // Set knob width.
        this.decorateRenderable('knob', layout.size(Switch.getKnobWidth(variation), 44));

        // Fades background color.
        this.knob.draggable.on('update', (event) => {
            this.decorateRenderable('selectedOuterBox', layout.opacity(event.position[0] / 46 + 0.0001));
        });

        // Hide soft shadow by default.
        // this.softShadowBox.setProperties({display: 'none'});

        this._setShadows(options);
    }

    _onTouchStart() {
        this._isOn = !this._isOn;
        // this.decorateRenderable('knob', layout.stick.center(), layout.translate(0, 0, 0));

    }

    _onTouchEnd() {
        if (this._isOn) {
            this.knob.draggable.setPosition([0,0], {curve: Easing.outBack, duration: 200});
        } else {
            this.knob.draggable.setPosition([46,0], {curve: Easing.outBack, duration: 200});
        }
        this.decorateRenderable('selectedOuterBox', layout.opacity(this._isOn ? 0.0001 : 1));
    }

    _setShadows(options) {
        let {shadowType} = options;
        if (shadowType === 'softShadow') {
            // this.softShadowBox.setProperties({display: 'block'});
        } else if (shadowType === 'hardShadow') {
            this.outerBox.setProperties({boxShadow: 'inset 0px 2px 0px 0px rgba(0,0,0,0.12)'});
            this.knob.setProperties({boxShadow: '0px 2px 0px 0px rgba(0,0,0,0.12)'});
        }
    }

}