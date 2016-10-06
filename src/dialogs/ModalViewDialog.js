/**
 * Created by vlad on 29/07/16.
 */

import Surface                                              from 'famous/core/Surface.js';
import {combineOptions}                                     from "arva-js/utils/CombineOptions.js";
import {layout}                                             from 'arva-js/layout/Decorators.js';
import {View}                                               from 'arva-js/core/View.js';
import {UITitle}                                            from '../defaults/DefaultTypefaces.js';
import {UIBarTextButton}                                    from '../buttons/UIBarTextButton.js';
import {UIBar}                                              from '../uibars/UIBar.js';
import {Text}                                               from '../text/Text.js';

export class ModalViewDialog extends View {

    @layout.translate(0, 0, -10)
    @layout.fullSize()
    background = new Surface({properties: {backgroundColor: 'white', borderRadius: '4px'}});

    @layout.dock.top(true)
    uibar = new UIBar({bottomLine: true, ...this.options.UIBarOptions});

    /**
     * @example
     * modal = new ModalViewDialog({
     *     variation: 'colored',
     *     title: 'Movie info',
     *     leftButton: {
     *         content: 'Edit',
     *         variation: 'light'
     *     },
     *     rightButton: {
     *         content: 'Done',
     *         variation: 'default'
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
     * @param {Boolean} [options.rightButton] Add a button on the right side of the ModalViewDialog's UIBar.
     *          Contains the sub-options 'content', which specifies the text inside the button, and 'variation', which can
     *          be set to 'light' in order to set button text typeface to UIButtonPrimaryLight instead of UIButtonPrimary.
     */
    constructor(options = {}) {
        let UIBarOptions = ModalViewDialog._setOptions(options);

        super(combineOptions({
            UIBarOptions
        }, options));

        if(options.content){
            let {content} = options;
            this.addRenderable(content, 'mainContent', layout.dock.fill());
        }
    }

    getSize(){
        return [undefined, undefined];
    }

    maxSize = [800, 800];

    static _setOptions({rightButton, leftButton, title, variation}) {
        let components = [];
        
        if(leftButton) {
            components.push([new UIBarTextButton(leftButton), 'leftButton', 'left']);
        }
        if(title) {
            components.push([new Text(combineOptions(UITitle, {content: title})), 'title', 'center']);
        }
        if(rightButton){
            components.push([new UIBarTextButton(rightButton), 'rightButton', 'right']);
        }

        return {variation, components};
    }
}