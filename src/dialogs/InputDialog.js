/**
 * Created by Manuel on 14/07/16.
 */

import {layout}                 from 'arva-js/layout/decorators.js';

import {BaseDialog}             from './BaseDialog.js';
import {TextButton}             from '../buttons/TextButton.js';
import {SingleLineInputSurface} from "../../surfaces/input/SingleLineInputSurface";

@layout.margins([10,10,10,10])
export class InputDialog extends BaseDialog {

    @layout.dock('top', function(){return this.options.buttonHeight || 64})
    input = new SingleLineInputSurface({
        placeholder: this.options.inputText || 'input'
    });

    @layout.dock('bottom', function(){return this.options.buttonHeight || 64})
    button = new TextButton({
        content: this.options.buttonText,
        disableBoxShadow: true,
        clickEventName: 'submit',
        backgroundProperties: {
            borderTop: '1px #E6e6e6 solid',
            boxShadow: 'none'
        }
    });

}