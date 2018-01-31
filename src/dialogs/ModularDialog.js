/**
 * Created by vlad on 29/07/16.
 */

import {Surface}        from 'arva-js/surfaces/Surface.js';

import {View}                                               from 'arva-js/core/View.js';
import {layout, bindings}                                   from 'arva-js/layout/Decorators.js';
import {Dialog}                                             from 'arva-js/components/Dialog.js';
import {combineOptions}                                     from 'arva-js/utils/CombineOptions.js';

import {UIBar}                                              from '../uibars/UIBar.js';
import {UIBarTitle}                                         from '../text/UIBarTitle.js';
import {UIBarTextButton}                                    from '../buttons/UIBarTextButton.js';
import {UIBarIconButton}                                    from '../buttons/UIBarIconButton.js';

@bindings.setup({
        backgroundColor: 'white',
        title: '',
        UIBarOptions: {
        }
})
/**
 * @example
 * modal = new ModularDialog({
     *     variation: 'colored',
     *     title: 'Movie info',
     *     leftButton: {
     *         content: 'Edit',
     *         variation: 'light'
     *     },
     *     rightButton: {
     *         icon: CrossIcon // From arva-kit/icons/CrossIcon.js
     *     }
     *     content: new Surface()
     * });
 *
 * Container that can be placed at the top or bottom of the view, in which you can put a collection of components like buttons, etc.
 *
 * @param {Object} options Construction options
 * @param {String} [options.variation] The variation of the UIBar inside the ModalViewDialog ('white' [default], 'colored')
 * @param {String} [options.title] The title to be displayed in the center of the UIBar
 * @param {Boolean} [options.leftButton] Add a button on the left side of the ModalViewDialog's UIBar.
 *          Contains the sub-options 'content', which specifies the text inside the button, and 'variation', which can
 *          be set to 'light' in order to set button text typeface to UIButtonPrimaryLight instead of UIButtonPrimary.
 *          Alternatively, can have sub-option 'icon', which turns the button into a UIBarImageButton.
 * @param {Boolean} [options.rightButton] Identical to leftButton, but on the right side of the ModalViewDialog's UIBar.
 */
export class ModularDialog extends Dialog {

    @layout.translate(0, 0, -10)
    @layout.fullSize()
    background = Surface.with({properties: {backgroundColor: this.options.backgroundColor, borderRadius: '4px'}});

    @layout.dock.top(true)
    uibar = UIBar.with({bottomLine: true, ...this.options.UIBarOptions}, {
        @layout.stick.center().size(true, true).translate(0, 0, 100)
        title: UIBarTitle.with({content: this.options.title}),
        @layout.dock.left(true).size()
        leftButton: this.options.leftButton,
        @layout.dock.right(true).size()
        rightButton: this.options.rightButton,
    });

    @layout.dock.fill()
    mainContent = this.options.content && this.options.content;


    getSize(){
        return [undefined, undefined];
    }

    maxSize = [720, 720];
}