/**
 * Created by tom on 13/09/16.
 */

import Surface                  from 'famous/core/Surface.js';
import Easing                   from 'famous/transitions/Easing.js';
import {layout, flow, event}    from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';

import {UIRegular}              from '../../text/UIRegular.js';
import {Ripple}                 from '../../components/Ripple.js';
import {Clickable}              from '../../components/Clickable.js';
import {BaseIcon}               from '../../icons/views/BaseIcon.js';
import crossImage			    from '../../icons/resources/cross_default.svg.txt!text';
import doneImage			    from '../../icons/resources/done_default.svg.txt!text';
import asteriskImage            from './asterisk.svg.txt!text';

const transitions = { transition: { curve: Easing.outCubic, duration: 100 } };
const closeTransition = { transition: { curve: Easing.outCubic, duration: 20 } };

@layout.dockPadding(0, 8)
export class FeedbackBubble extends Clickable {

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

    @layout.fullSize()
    @layout.translate(0, 0, 30)
    @event.on('click', function() { this.toggle(); })
    @layout.clip(undefined, undefined, { borderRadius: '2px', cursor: 'pointer' })
    ripple = new Ripple(combineOptions({ sizeMultiplier: 5} , this.options.rippleOptions));
    
    setText(text) {
        this.text.setContent(text);
    }

    expand() {
        this.setRenderableFlowState('background', 'shown');
        this.setRenderableFlowState('text', 'shown');
    }

    collapse() {
        this.setRenderableFlowState('text', 'hidden');
    }

    toggle() {
        let newState = this.getRenderableFlowState('text') === 'shown' ? 'hidden' : 'shown';
        this.setRenderableFlowState('text', newState);
    }


    /* Shows Ripple */
    _handleTapStart({x, y}) {
        if (this._isEnabled()) {
            this._inBounds = true;
            /**
             * Calculate the correct position of the click inside the current renderable (overlay taken for easy calculation, as it's always fullSize).
             * This will not account for rotation/skew/any other transforms except translates so if the Button class is e.d rotated the ripple will not be placed in the correct location
             * @type {ClientRect}
             */
            let boundingBox = this.background._currentTarget.getBoundingClientRect();
            this.ripple.show(x - boundingBox.left, y - boundingBox.top);
        }
    }

    _handleTouchMove(touchEvent){
        if (this._inBounds) {
            this.throttler.add(()=>{
                this._inBounds = this._isInBounds(touchEvent);
                if(!this._inBounds){
                    this.ripple.hide();
                }
            });
        }
    }

    _handleTapEnd(mouseEvent) {
            this.ripple.hide();
        return mouseEvent.type === 'touchend' && this._isInBounds(mouseEvent) && this._handleClick(mouseEvent);
    }

    /**
     * Checks if the current TouchEvent is outside the current target element
     * @param touch
     * @param elemposition
     * @param width
     * @param height
     * @returns {boolean}
     * @private
     */
    _isInBounds(touch) {
        let elemPosition = this.overlay._currentTarget.getBoundingClientRect();
        let [width, height] = this.overlay.getSize();

        let touchList = touch.touches.length ? touch.touches : touch.changedTouches;

        var left = elemPosition.left,
            right = left + width,
            top = elemPosition.top,
            bottom = top + height,
            touchX = touchList[0].pageX,
            touchY = touchList[0].pageY;

        return (touchX > left && touchX < right && touchY > top && touchY < bottom);
    };
}