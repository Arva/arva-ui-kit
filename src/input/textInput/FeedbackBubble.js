/**
 * Created by tom on 13/09/16.
 */

import Surface                  from 'famous/core/Surface.js';
import {View}                   from 'arva-js/core/View.js';
import {layout, flow, event}    from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';

import {UIRegular}              from '../../text/UIRegular.js';
import {BaseIcon}               from '../../icons/views/BaseIcon.js';
import crossImage			    from '../../icons/resources/cross_default.svg.txt!text';
import doneImage			    from '../../icons/resources/done_default.svg.txt!text';
import asteriskImage            from './asterisk.svg.txt!text';

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
            borderRadius: '2px'
        }
    });

    @layout.size(24, 24)
    @layout.dock.right()
    @layout.stick.center()
    @event.on('click', function() { this.toggle(); })
    icon = new BaseIcon({
        icon: FeedbackBubble.icons[this.options.variation],
        color: 'rgb(255, 255, 255)'
    });

    @event.on('click', function() { this.toggle(); })
    @flow.stateStep('shown', {}, layout.size(true, undefined), layout.opacity(1))
    @flow.defaultState('hidden', {}, layout.size(0, 0), layout.opacity(0), layout.dock.right(), layout.dockSpace(8), layout.stick.right())
    text = new UIRegular({
        content: this.options.text || FeedbackBubble.texts[this.options.variation],
        properties: {
            color: 'rgb(255, 255, 255)',
            lineHeight: '40px',
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