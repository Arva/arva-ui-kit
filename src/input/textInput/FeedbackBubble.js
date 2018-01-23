/**
 * Created by tom on 13/09/16.
 */

import {Surface} from 'arva-js/surfaces/Surface.js';
import Easing from 'famous/transitions/Easing.js';
import {
    layout, flow,
    event, bindings, dynamic
} from 'arva-js/layout/Decorators.js';
import {combineOptions} from 'arva-js/utils/CombineOptions.js';

import {UIRegular} from '../../text/UIRegular.js';
import {BaseIcon} from '../../icons/views/BaseIcon.js';
import asteriskImage from './asterisk.svg.txt!text';
import {Button} from '../../buttons/Button.js';
import {Dimensions} from '../../defaults/DefaultDimensions.js';

import crossImage from '../../icons/resources/cross_default.svg.txt!text';
import doneImage from '../../icons/resources/done_default.svg.txt!text';
import {ComponentPadding} from '../../defaults/DefaultDimensions';

const transition = {curve: Easing.outCubic, duration: 200};
const closeTransition = {curve: Easing.outCubic, duration: 20};


let icons = {
    'required': asteriskImage,
    'incorrect': crossImage,
    'correct': doneImage
};

let texts = {
    'required': 'Required',
    'incorrect': 'Incorrect',
    'correct': 'Correct'
};

@layout.dockPadding(0, 8)
@bindings.setup({
    backgroundProperties: {borderRadius: '2px'},
    state: 'incorrect',
    expanded: false,
    showText: false,
    requiredColor: 'rgb(170, 170, 170)',
    incorrectColor: 'rgb(255,63,63)',
    correctColor: 'rgb(63, 223, 63)',
    useBoxShadow: false
})
export class FeedbackBubble extends Button {

    @bindings.trigger()
    changeColorOnStateChange() {
        this.options.backgroundProperties.backgroundColor =
            {
                incorrect: this.options.requiredColor,
                correct: this.options.correctColor,
                required: this.options.requiredColor,
            }[this.options.state];
    }

    @bindings.trigger()
    async triggerReflowOnExpand({expanded}) {
        if (expanded) {
            let expandedWidth = this.getResolvedSize(this.text)[0] + 8 + this.getResolvedSize(this.icon)[0] + Dimensions.ComponentPadding;
            let translationForLeftAdjustment = this.getSize()[0] - expandedWidth;
            this.decorateRenderable(this.ripple,
                flow.transition(transition)(
                    layout.size(expandedWidth, undefined).translateFrom(translationForLeftAdjustment, 0, 0)
                )
            );
            await this.whenFlowFinished(this.ripple);
            this.ripple.readjustRippleSize(5);
            this.options.showText = true;
        } else {
            this.options.showText = false;
            await this.whenFlowFinished(this.text);
            this.ripple && this.ripple.readjustRippleSize(2);
            this.decorateRenderable(this.ripple,
                flow.transition(transition)(
                    layout.fullSize().translate(0, 0, -10)
                ))
        }
    }

    @layout.size(24, 24)
        .dock.right()
        .stick.center()
        .translate(0, 0, 20)
    icon = BaseIcon.with({
        icon: icons[this.options.state],
        color: 'rgb(255, 255, 255)',
        properties: {
            cursor: 'pointer'
        }
    });

    _onFocus() {
        this.options.expanded = true;
    }

    _onBlur() {
        this.options.expanded = false;
    }


    @layout.dock.right(~100).dockSpace(8).translate(0, 0, 10)
    @dynamic(({showText}) => flow.transition(transition)(layout.opacity(showText ? 1 : 0)))
    text = UIRegular.with({
        content: this.options.text || texts[this.options.state],
        properties: {
            color: 'rgb(255, 255, 255)',
            lineHeight: '40px'
        }
    });


    getSize() {
        let height = Dimensions.ComponentHeight - 4 * 2;
        /* Display as square*/
        return [height, height];
    }

}
