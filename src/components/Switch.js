/**
 * Created by vlad on 31/08/16.
 */

import {Surface} from 'arva-js/surfaces/Surface.js';
import Timer from 'famous/utilities/Timer.js';
import Easing from 'famous/transitions/Easing.js';
import {combineOptions} from 'arva-js/utils/CombineOptions.js';
import {Knob} from '../sliders/Knob.js';
import {Clickable} from './Clickable.js';
import {Colors} from '../defaults/DefaultColors.js';
import {CheckIcon} from './icons/CheckIcon.js';
import {CrossIcon} from './icons/CrossIcon.js';
import {
    layout, flow, bindings, dynamic, event
} from 'arva-js/layout/Decorators.js';


const knobOffset = 2;
const iconSize = [16, 16];
const iconColor = 'rgba(0, 0, 0, 0.1)';
const curve = {curve: Easing.outBack, duration: 200};

let totalWidthForSizes = {
    small: 48,
    medium: 94,
    large: undefined
};


@dynamic(() =>
    bindings.setup({
        state: false,
        activeColor: Colors.PrimaryUIColor,
        inactiveColor: 'rgb(170, 170, 170)',
        variation: 'small',
        shadowType: 'noShadow',
        _sizeCache: [100, 0],
        size: 'small'
    })
)

export class Switch extends Clickable {

    @bindings.trigger()
    correctOnIllegalCombo({size, text}) {
        if (!['small', 'medium', 'large'].includes(size)) {
            throw new Error(`Invalid size ${size} specified to switch!`);
        }

        if (size !== 'large' && text) {
            console.log('Switch warning: Cannot display text in small mode. Removing text');
            this.options.text = '';
        }
    }

    @bindings.trigger()
    setKnobPosition({state}) {
        let {knob} = this;
        if(knob){
            let {draggable} = knob;
            draggable.setPosition([draggable.options.xRange[state ? 1 : 0],0], curve);
        }
    }

    @layout.fullSize()
        .translate(0, 0, 0)
    outerBox = new Surface({
        properties: {
            borderRadius: '4px',
            backgroundColor: this.options.inactiveColor

        }
    });

    @layout.fullSize()
        .translate(0, 0, 10)
    @dynamic(({state}) => flow.transition(curve)(layout.opacity(state ? 1 : 0)))
    selectedOuterBox = Surface.with({
        properties: {
            borderRadius: '4px',
            backgroundColor: this.options.activeColor
        }
    });

    @layout.size(...iconSize)
        .stick.left()
        .translate(16, 0, 20)
    tick = this.options.size !== 'small' && CheckIcon.with({color: iconColor});

    @layout.size(...iconSize)
        .stick.right()
        .translate(-16, 0, 20)
    cross = this.options.size !== 'small' && CrossIcon.with({color: iconColor});

    @event.on('buttonClick', function () {
        if(Date.now() - this._clickStarted < 250){
            this.options.state = !this.options.state;
        }
    }).on('end', function ({position}) {
        this._snapState(position);
    }).on('start', function () {
        this._clickStarted = Date.now();
    })
    @dynamic(({size, _sizeCache}) => {
            let width = {
                small: 30,
                medium: 44,
                large: Math.max(_sizeCache[0] - 94/2, 0)
            }[size];

                /* TODO: Fix bug that is causing 44.1 to be necessary (rendered as 44.09, or 43.99 otherwise) */
            return layout.size(width, 44.1)
                .draggable({xRange: [0, (totalWidthForSizes[size] || _sizeCache[0]) - width - knobOffset * 2], projection: 'x'})
        }
    )
    @layout.stick.left()
        .translate(knobOffset, 0, 30)
    knob = Knob.with({
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
        super(options);
        this.on('newSize', (size) => this.options._sizeCache = size, {propagate: false});

    }

    getSize() {
        return [totalWidthForSizes[this.options.size], 48];
    }

    _handleClick() {
        if(!this.knob.draggable.isChangingPosition()){
            this.options.state = !this.options.state;
        }
    }

    _handleTapRemoved() {
        this._snapState();
    }

    _snapState (position = this.knob.draggable.getPosition()) {
        let {xRange} = this.knob.draggable.options;
        this.options.state = position[0] > ((xRange[1] / 2) + xRange[0]);
        this.setKnobPosition(this.options);
    }
}