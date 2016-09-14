/**
 * Created by tom on 13/09/16.
 */

import Surface                  from 'famous/core/Surface.js';
import Easing                   from 'famous/transitions/Easing.js';
import {View}                   from 'arva-js/core/View.js';
import {layout, flow, event}    from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';

import {UIRegular}              from '../../text/UIRegular.js';
import {BaseIcon}               from '../../icons/views/BaseIcon.js';
import crossImage			    from '../../icons/resources/cross_default.svg.txt!text';
import doneImage			    from '../../icons/resources/done_default.svg.txt!text';
import asteriskImage            from './asterisk.svg.txt!text';

const options = { transition: { curve: Easing.outCubic, duration: 20 } };

// @flow.viewStates()
@layout.dockPadding(0, 8)
export class FeedbackBubble extends View {

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

    @layout.fullSize()
    @event.on('click', function() { this.toggle(); })
    background = new Surface({
        properties: {
            backgroundColor: FeedbackBubble.colors[this.options.variation],
            borderRadius: '2px',
            cursor: 'pointer'
        }
    });

    @layout.size(24, 24)
    @layout.dock.right()
    @layout.stick.center()
    @layout.translate(0, 0, 20)
    @event.on('click', function() { this.toggle(); })
    icon = new BaseIcon({
        icon: FeedbackBubble.icons[this.options.variation],
        color: 'rgb(255, 255, 255)',
        properties: {
            cursor: 'pointer'
        }
    });

    @event.on('click', function() { this.toggle(); })
    @flow.stateStep('shown', { transition: { curve: Easing.outCubic, duration: 20000 }}, layout.dock.right(~30), layout.dockSpace(8))
    @flow.stateStep('shown', options, layout.opacity(1))
    @flow.stateStep('hidden', options, layout.opacity(0))
    @flow.defaultState('hidden', options, layout.size(undefined, undefined), layout.opacity(0), layout.dock.none(), layout.translate(0, 0, 10))
    text = new UIRegular({
        content: this.options.text || FeedbackBubble.texts[this.options.variation],
        properties: {
            color: 'rgb(255, 255, 255)',
            lineHeight: '40px',
            overflow: 'hidden',
            cursor: 'pointer',
            textAlign: 'right'
        }
    });
    
    setText(text) {
        this.text.setContent(text);
    }

    expand() {
        this.setRenderableFlowState('text', 'shown');
    }

    collapse() {
        this.setRenderableFlowState('text', 'hidden');
    }

    toggle() {
        let newState = this.getRenderableFlowState('text') === 'shown' ? 'hidden' : 'shown';
        this.setRenderableFlowState('text', newState);
    }
}