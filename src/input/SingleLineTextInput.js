/**
 * Created by tom on 12/09/16.
 */

import {View}                   from 'arva-js/core/View.js';
import {layout}                 from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {SingleLineInputSurface} from './SingleLineInputSurface.js';
import {FeedbackBubble}         from './textInput/FeedbackBubble.js';

export class SingleLineTextInput extends View {

    @layout.dock.left()
    input = new SingleLineInputSurface({content: this.options.content || ''});

    @layout.dock.right()
    @layout.stick.center()
    @layout.size(~40, 40)
    // @layout.dockSpace(8)
    correct = new FeedbackBubble({ variation: 'correct' });

    getSize() {
        return [undefined, 48];
    }
}    