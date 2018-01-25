/**
 * Created by lundfall on 12/07/16.
 */
import {combineOptions}                 from 'arva-js/utils/CombineOptions.js';
import {Colors}                         from '../defaults/DefaultColors.js';
import {ColoredTextButton}                from './ColoredTextButton.js';
import {WhiteIconButton}                    from './WhiteIconButton.js';
import {layout, bindings, dynamic}  from 'arva-js/layout/Decorators.js';


@dynamic(() =>
    bindings.setup({
        disabledBackgroundColor: Colors.Gray,
        enabledBackgroundColor: Colors.PrimaryUIColor,
        properties: {color: 'white'},
        backgroundProperties: { borderRadius: '50%' }
    })
)
export class FloatingIconButton extends WhiteIconButton {

    @bindings.trigger()
    changeBackgroundOnDisable() {
        this.options.backgroundProperties.backgroundColor =
            this.options.enabled ? this.options.enabledBackgroundColor :
                this.options.disabledBackgroundColor
    }

    /* Default if true size specified */
    getSize() {
        return [64, 64];
    }
}
