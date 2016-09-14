/**
 * Created by tom on 12/09/16.
 */

import {View}                   from 'arva-js/core/View.js';
import {layout}                 from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {SingleLineInputSurface} from './SingleLineInputSurface.js';
import {FeedbackBubble}         from './textInput/FeedbackBubble.js';

export class SingleLineTextInput extends View {

    @layout.size(undefined, undefined)
    input = new SingleLineInputSurface({
        content: this.options.content || '',
        properties: {
            padding: '0px 48px 0px 16px'
        }
    });

    @layout.size(~40, 40)
    @layout.stick.right()
    @layout.translate(-4, 0, 10)
    correct = new FeedbackBubble({variation: 'correct'});

    getSize() {
        return [undefined, 48];
    }
}    