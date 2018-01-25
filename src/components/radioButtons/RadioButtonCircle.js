/**
 * Created by vlad on 19/09/16.
 */

import {Surface}        from 'arva-js/surfaces/Surface.js';
import Easing               from 'famous/transitions/Easing.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Clickable}          from "../Clickable.js";
import {Colors}             from '../../defaults/DefaultColors.js';
import {getShadow}          from '../../defaults/DefaultShadows.js';
import {layout, dynamic, bindings, flow}   from 'arva-js/layout/Decorators.js';

const inCurve = {curve: Easing.outCubic, duration: 200};
const outCurve = {curve: Easing.outBack, duration: 200};

@dynamic(() =>
    bindings.setup({
        selected: false,
        activeColor: Colors.PrimaryUIColor,
        passiveColor: Colors.White
    })
)
export class RadioButtonCircle extends Clickable {

    @layout.fullSize()
        .translate(0, 0, 0)
    backgroundCircle =  Surface.with({
        properties: {
            backgroundColor: this.options.activeColor,
            borderRadius: '50%',
            boxShadow: getShadow({
                color: this.options.activeColor,
                onlyForShadowType: 'hard',
                inset: true
            })
        }
    });

    @dynamic(({selected}) =>
        selected ?
            flow.transition(inCurve)(layout.scale(0, 0, 0))
        :   flow.transition(outCurve)(layout.scale(1, 1, 1))
    )
    @layout.size(44, 44)
        .stick.center()
        .translate(0, 0, 20)
    innerCircle = Surface.with({
        properties: {
            borderRadius: '50%',
            backgroundColor: this.options.passiveColor,
            boxShadow: getShadow({})
        }
    });


    @layout.size(24, 24)
        .stick.center()
        .translate(0, 0, 30)
    icon = this.options.icon && this.options.icon.with({color: this.options.selected ? this.options.passiveColor : this.options.activeColor});

}