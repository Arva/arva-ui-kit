/**
 * Created by tom on 13/09/16.
 */

import Surface                  from 'famous/core/Surface.js';
import Easing                   from 'famous/transitions/Easing.js';
import {layout, flow, event}    from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';

import {UIRegular}              from '../../text/UIRegular.js';
import {BaseIcon}               from '../../icons/views/BaseIcon.js';
import asteriskImage            from './asterisk.svg.txt!text';
import {Button}                 from '../../buttons/Button.js';

import crossImage                from '../../icons/resources/cross_default.svg.txt!text';
import doneImage                from '../../icons/resources/done_default.svg.txt!text';

const transitions = { transition: { curve: Easing.outCubic, duration: 100 } };
const closeTransition = { transition: { curve: Easing.outCubic, duration: 20 } };

@layout.dockPadding(0, 8)
export class FeedbackBubble extends Button {

    static colors = {
        'required': 'rgb(170, 170, 170)',
        'incorrect': 'rgb(255,63,63)',
        'correct': 'rgb(63, 223, 63)'
    };

    static icons = {
        'required': asteriskImage,
        'incorrect': crossImage,
        'correct': doneImage
    };

    static texts = {
        'required': 'Required',
        'incorrect': 'Incorrect',
        'correct': 'Correct'
    };

    @layout.size(24, 24)
    @layout.dock.right()
    @layout.stick.center()
    @layout.translate(0, 0, 20)
    icon = new BaseIcon({
        icon: FeedbackBubble.icons[this.options.variation],
        color: 'rgb(255, 255, 255)',
        properties: {
            cursor: 'pointer'
        }
    });

    @flow.stateStep('shown', transitions, layout.dock.right(~30), layout.dockSpace(8))
    @flow.stateStep('shown', transitions, layout.opacity(1))
    @flow.stateStep('hidden', closeTransition, layout.opacity(0))
    @flow.stateStep('hidden', closeTransition, layout.size(undefined, undefined), layout.dock.none())
    @flow.defaultState('hidden', closeTransition, layout.size(undefined, undefined), layout.dock.none(), layout.translate(0, 0, 10), layout.opacity(0))
    text = new UIRegular({
        content: this.options.text || FeedbackBubble.texts[this.options.variation],
        properties: {
            color: 'rgb(255, 255, 255)',
            lineHeight: '40px',
            overflow: 'hidden',
            cursor: 'pointer',
            textAlign: 'right',
            whiteSpace: 'nowrap'
        }
    });

    setText(text) {
        this.text.setContent(text);
    }

    async expand() {
        await Promise.all(this.setRenderableFlowState('background', 'shown'), this.setRenderableFlowState('text', 'shown'));
        this.reflowRecursively();
    }

    async collapse() {
        await this.setRenderableFlowState('text', 'hidden');
        this.reflowRecursively();

    }

    async toggle() {
        let newState = this.getRenderableFlowState('text') === 'shown' ? 'hidden' : 'shown';
        await this.setRenderableFlowState('text', newState);
        this.reflowRecursively();

    }

    constructor(options) {
        super(combineOptions({
            backgroundProperties: {
                backgroundColor: options.feedbackBubbleColor ? options.feedbackBubbleColor : FeedbackBubble.colors[options.variation],
                cursor: 'pointer'
            },
            useBoxShadow: false
        }, options));

        this.on('click', this.toggle.bind(this));
    }
}