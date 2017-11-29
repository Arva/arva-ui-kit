/**
 * Created by Manuel on 14/07/16.
 */

import {layout}                 from 'arva-js/layout/Decorators.js';

import {BaseDialog}             from './BaseDialog.js';
import {WhiteTextButton}             from '../buttons/WhiteTextButton.js';
import {SingleLineInputSurface} from '../input/SingleLineInputSurface';
import {ComponentHeight}        from '../defaults/DefaultDimensions.js';

@layout.dockPadding(24,0,0,0)
export class InputDialog extends BaseDialog {

    @layout.dock.top( function(){return this.options.buttonHeight || ComponentHeight}, 24)
    input = new SingleLineInputSurface({
        placeholder: this.options.inputText || 'input'
    });

    @layout.dock.top( function(){return this.options.buttonHeight || ComponentHeight}, 24, 10)
    button = new WhiteTextButton({
        content: this.options.buttonText,
        disableBoxShadow: true,
        clickEventName: 'submit',
        backgroundProperties: {
            borderTop: '1px #E6e6e6 solid',
            boxShadow: 'none'
        }
    });

    onNewMargin(newMargin) {
    }

}