/**
 * Created by lundfall on 12/07/16.
 */

import {layout, bindings, event, dynamic}   from 'arva-js/layout/Decorators.js';

import {BaseDialog}                         from './BaseDialog.js';
import {WhiteTextButton}                    from '../buttons/WhiteTextButton.js';
import {View}                               from 'arva-js/core/View.js';

let separationBorder = '1px #E6e6e6 solid';

/**
 * @example
 * new ButtonDialog({button: {buttonText: 'Confirm'}, title: 'Hello', body: 'World'})
 *
 * @param {Object} [options] Constructor options
 * @param {String} [options.button.buttonText] The text for the button. Defaults to 'Ok'
 * @param {String} [options.title] The title of the Dialog
 * @param {String} [options.body] The body of the Dialog
 */
@bindings.setup({
    buttons: ['Ok'],
    rounded: false,
    buttonType: WhiteTextButton,
    borderRadius: '4px',
    allButtonOptions: {},
    stackHorizontal: false
})
export class ButtonDialog extends BaseDialog {

    @bindings.trigger()
    setBorderRadiusIfRounded() {
        if (this.options.rounded) {
            this.options.borderRadius = '24px';
        }
    }


    @layout.dock.top(true).dockSpace(32).columnDockPadding(Infinity, [0]).translate(0, 32, 0)
    buttons = ({stackHorizontal, buttons, borderRadius, allButtonOptions}) => View.with({}, {
        @layout.dock[stackHorizontal ? 'left' : 'top']().size(stackHorizontal ? 1 / buttons.length : undefined, 64)
        buttons: buttons.map((buttonOptions, index) =>
            event.on('closeDialog', () => this._eventOutput.emit('buttonClicked', index))
            (
                this.options.buttonType.with({
                    disableBoxShadow: true,
                    clickEventName: 'closeDialog',
                    clickEventData: [index],
                    backgroundProperties: {
                        borderTop: separationBorder,
                        borderRight: stackHorizontal ? separationBorder : 'none',
                        borderRadius:
                            `0px
                             0px
                            ${(index === (buttons.length - 1 ))
                                    ? borderRadius : '0px'}
                            ${((stackHorizontal && index === 0) || (!stackHorizontal && index === (buttons.length - 1 )))
                                    ? borderRadius : '0px'}`
                    },
                    ...buttonOptions,
                    ...allButtonOptions
                })
            ))
    })


}