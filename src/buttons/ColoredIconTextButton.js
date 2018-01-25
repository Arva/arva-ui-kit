/**
 * Created by paulvanmotman on 22/08/2017.
 */

import {combineOptions}             from 'arva-js/utils/CombineOptions.js';

import {WhiteIconTextButton}        from './WhiteIconTextButton.js';
import {Colors}                     from '../defaults/DefaultColors';
import {layout, bindings, dynamic} from 'arva-js/layout/Decorators.js';

@dynamic(() =>
    bindings.setup({
        enabledColor: 'white',
        disabledColor: 'white',
        disabledBackgroundColor: Colors.Gray,
        enabledBackgroundColor: Colors.PrimaryUIColor
    })
)
export class ColoredIconTextButton extends WhiteIconTextButton {
    @bindings.trigger()
    changeBackgroundOnDisable() {
        this.options.backgroundProperties.backgroundColor =
            this.options.enabled ? this.options.enabledBackgroundColor :
                this.options.disabledBackgroundColor
    }
}
