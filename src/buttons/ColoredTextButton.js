/**
 * Created by lundfall on 12/07/16.
 */

import {combineOptions} from 'arva-js/utils/CombineOptions.js';
import {WhiteTextButton} from './WhiteTextButton.js';
import {layout, bindings, dynamic}  from 'arva-js/layout/Decorators.js';
import {Colors}                     from '../defaults/DefaultColors.js';


@dynamic(() =>
    bindings.setup({
        disabledBackgroundColor: Colors.Gray,
        enabledBackgroundColor: Colors.PrimaryUIColor,
        properties:  {color: 'white'},
        disabledOptions: { properties: {color: 'white'} }
    })
)
export class ColoredTextButton extends WhiteTextButton {

    @bindings.trigger()
    changeBackgroundOnDisable() {
        this.options.backgroundProperties.backgroundColor =
            this.options.enabled ? this.options.enabledBackgroundColor :
                this.options.disabledBackgroundColor
    }

}
