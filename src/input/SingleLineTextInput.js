/**
 * Created by tom on 12/09/16.
 */

import Surface                  from 'famous/core/Surface.js';
import Easing                   from 'famous/transitions/Easing.js';
import {View}                   from 'arva-js/core/View.js';
import {layout, flow}           from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {SingleLineInputSurface} from './SingleLineInputSurface.js';
import {FeedbackBubble}         from './textInput/FeedbackBubble.js';
import {Dimensions}             from '../defaults/DefaultDimensions.js';

let {searchBar: {borderRadius}} = Dimensions;
const transition = { transition: { curve: Easing.outCubic, duration: 200 } };

export class SingleLineTextInput extends View {

    @flow.stateStep('hidden', transition, layout.opacity(0))
    @flow.defaultState('shown', transition, layout.stick.center(), layout.opacity(1), layout.translate(0, 0, 10))
    border = new Surface({
            properties: {
                border: 'solid 1px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgb(255, 255, 255)',
                borderRadius: borderRadius,
                boxSizing: 'border-box'
            }
        }
    );

    @flow.stateStep('shown', transition, layout.opacity(1))
    @flow.defaultState('hidden', transition, layout.stick.center(), layout.opacity(0), layout.translate(0, 0, 20))
    shadow = new Surface({
            properties: {
                boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.12)',
                backgroundColor: 'rgb(255, 255, 255)',
                borderRadius: borderRadius
            }
        }
    );

    @layout.dock.fill()
    @layout.translate(0, 0, 30)
    input = new SingleLineInputSurface({
        content: this.options.content || '',
        properties: {
            backgroundColor: 'transparent',
            padding: '0px 16px 0px 16px',
            borderRadius: borderRadius,
            boxShadow: 'none'
        }
    });

    @layout.dock.right()
    @layout.stick.center()
    @layout.size(~40, 40)
    correct = new FeedbackBubble({variation: 'correct'});

    getSize() {
        return [undefined, 48];
    }
}    