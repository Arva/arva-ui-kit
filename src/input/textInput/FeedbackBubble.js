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
import {Button} from '../../buttons/Button.js';
import {Dimensions} from '../../defaults/DefaultDimensions.js';

import asteriskImage from '../icons/asterisk.svg.txt!text';
import crossImage from '../icons/cross.opacity.svg.txt!text';
import doneImage from '../icons/check.opacity.txt!text';

const transition = {curve: Easing.outCubic, duration: 200};


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
    useBoxShadow: false,
    correctText: 'Correct',
    incorrectText: 'Incorrect',
    requiredText: 'Required',
    text: 'Required'
})
export class FeedbackBubble extends Button {

    @bindings.trigger()
    changeColorOnStateChange() {
        this.options.backgroundProperties.backgroundColor =
            {
                incorrect: this.options.incorrectColor,
                correct: this.options.correctColor,
                required: this.options.requiredColor,
            }[this.options.state];
        this.options.text = {
            incorrect: this.options.incorrectText,
            correct: this.options.correctText,
            required: this.options.requiredText
        }[this.options.state];
    }

    @bindings.trigger()
    async triggerReflowOnExpand({expanded}) {
        if (expanded) {
            let expandedWidth = this.getResolvedSize(this.text)[0] + 12 + this.getResolvedSize(this.icon)[0] + Dimensions.ComponentPadding;
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

    @layout.size(16, 16)
        .dock.right(24)
        .stick.center()
        .translate(0, 0, 20)
    icon = BaseIcon.with({
        icon: icons[this.options.state],
        properties: {
            cursor: 'pointer'
        }
    });

    _onBlur() {
        this.options.expanded = false;
    }

    _onClick() {
        this.options.expanded = !this.options.expanded;
    }


    @layout.dock.right(~100).translate(0, 0, 10)
    @dynamic(({showText}) => flow.transition(transition)(layout.opacity(showText ? 1 : 0)))
    text = UIRegular.with({
        content: this.options.text,
        properties: {
            color: 'rgb(255,255,255)',
            lineHeight: '40px'
        }
    });


    getSize() {
        let height = Dimensions.ComponentHeight - 4 * 2;
        /* Display as square*/
        return [height, height];
    }

}
