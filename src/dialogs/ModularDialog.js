/**
 * Created by vlad on 29/07/16.
 */

import Surface                                              from 'famous/core/Surface.js';

import {View}                                               from 'arva-js/core/View.js';
import {layout}                                             from 'arva-js/layout/Decorators.js';
import {Dialog}                                             from 'arva-js/components/Dialog.js';
import {combineOptions}                                     from 'arva-js/utils/CombineOptions.js';

import {UIBar}                                              from '../uibars/UIBar.js';
import {UIBarTitle}                                         from '../text/UIBarTitle.js';
import {UIBarTextButton}                                    from '../buttons/UIBarTextButton.js';
import {UIBarImageButton}                                   from '../buttons/UIBarImageButton.js';

export class ModularDialog extends Dialog {

    @layout.translate(0, 0, -10)
    @layout.fullSize()
    background = new Surface({properties: {backgroundColor: this.options.backgroundColor, borderRadius: this.options.rounded ? '24px' : '4px'}});

    @layout.dock.top(true)
    uibar = new UIBar({bottomLine: true, ...this.options.UIBarOptions});

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
    constructor(options = {}) {
        let UIBarOptions = ModularDialog._setOptions(options);

        super(combineOptions({
            UIBarOptions,
            backgroundColor: 'white',
            rounded: false
        }, options));
        if (!this.options.showUIBar) {
            this.removeRenderable('uibar');
        }
        if (this.options.content) {
            let {content} = options;
            this.setContent(content);
        }
    }

    setContent(content) {
        this.content = content;
        if(content == undefined){
            console.warn('Content set to undefined in ModularDialog.setContent()!');
            return;
        }
        if(this.mainContent){
            this.hideRenderable('mainContent');
            this.replaceRenderable('mainContent', content);
            this.showRenderable('mainContent');
        } else{
            this.addRenderable(content, 'mainContent', layout.dock.fill(), layout.animate());
        }
    }

    getContent(){
        return this.content;
    }

    getSize(){
        return [undefined, undefined];
    }

    maxSize = [720, 720];

    static _setOptions({rightButton, leftButton, title, variation, shadowType}) {
        let components = [];

        if (leftButton) {
            let buttonType = leftButton.icon ? UIBarImageButton : UIBarTextButton;
            components.push([new buttonType(leftButton), 'leftButton', 'left']);
        }
        if (title) {
            components.push([new UIBarTitle({ content: title, properties: { cursor: 'default' } }), 'title', 'center']);
        }
        if (rightButton) {
            let buttonType = rightButton.icon ? UIBarImageButton : UIBarTextButton;
            components.push([new buttonType(rightButton), 'rightButton', 'right']);
        }

        return {variation, components, shadowType};
    }
}