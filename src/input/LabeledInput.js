/**
 * Created by tom on 23/09/16.
 */

import {View}                   from 'arva-js/core/View.js';
import {layout}                 from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {UISmallGray}            from '../text/UISmallGray.js';
import {SingleLineTextInput}    from './SingleLineTextInput.js';

export class LabeledInput extends View {

    @layout.dock.top(~20)
    label = new UISmallGray({
        content: this.options.label, properties: {
            /* Prevent line-breaks from happening */
            whiteSpace: 'nowrap'
        }
    });

    @layout.dock.top(~48)
    @layout.dockSpace(4)
    input = this.options.input
    
}    