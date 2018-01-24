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
        activeColor: 'white',
        backgroundProperties: { borderRadius: '50%' }
    })
)
export class FloatingIconButton extends WhiteIconButton {

    /* Default if true size specified */
    getSize() {
        return [64, 64];
    }
}
