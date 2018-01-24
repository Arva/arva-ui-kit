/**
 * Created by vlad on 01/09/16.
 */

import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {Button}                     from '../buttons/Button.js';
import {layout, flow, bindings, dynamic
}                           from 'arva-js/layout/Decorators.js';

@bindings.setup({
    rippleOptions: {sizeMultiplier: 4},
    backgroundProperties: {borderRadius: '2px'}
})
export class WhiteBox extends Button {

}