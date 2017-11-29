/**
 * Created by vlad on 09/02/2017.
 */

import get                                      from 'lodash/get.js';

import FamousContext                            from 'famous/core/Context.js';
import Surface                                  from 'famous/core/Surface.js';
import Easing                                   from 'famous/transitions/Easing.js';

import {View}                                   from 'arva-js/core/View.js';
import {Router}                                 from 'arva-js/core/Router.js';
import {Injection}                              from 'arva-js/utils/Injection.js';
import {layout, flow}                           from 'arva-js/layout/Decorators.js';
import {combineOptions}                         from 'arva-js/utils/CombineOptions.js';

@flow.viewStates({})
export class OverlayingButtons extends View {

    /**
     * Overlaying buttons which can be configured per controller and method
     *
     * @example
     * overlayingButtons = Injection.provide(OverlayingButtons, new OverlayingButtons({
     *     buttons: [{
     *         button: new FloatingIconButton({
     *             imageSize: [24, 24],
     *             icon: plus,
     *             backgroundProperties: {
     *                 backgroundColor: 'rgb(118, 20, 104)'
     *             }
     *         }),
     *         persistent: false // todo implement later
     *     }, ...],
     *     routes: {
     *         'Profile': {
     *             'Index': [0, 1, 2, 3],
     *             'Invoices': [3, 0],
     *             'Settings': [2, 1, 3]
     *         },
     *         'Home': {
     *             'Index': [0, 2, 1 3],
     *             'AddContainer': [1, 0, 2, 3]
     *         }
     *     }
     * }));
     *
     * @param {Object} options Construction options
     * @param {Array} [options.buttons] Array containing the Button classes to be used as overlaying buttons. The first
     *        button provided will have a size of 64 by 64 and subsequent buttons will have a size of 48 by 48.
     * @param {Object} [options.routes] Object containing the routes for which a specific set of buttons will be shown.
     *        The buttons to be shown have to be provided as an array of indexes which correspond to the button positions
     *        in options.buttons. This array can have a size between 0 and teh length of the buttons array. The order of
     *        the visible buttons is determined by the order the button indexes are provided in.
     *        If the array [2, 0] is provided to a route, then the button at index 2 of options.buttons will be shown
     *        first from the bottom, and the button at index 0 of options.buttons will be shown second from the bottom.
     */
    constructor(options = {}) {
        super(combineOptions({
            showAnimation: {transition: {duration: 200, curve: Easing.outBack}},
            hideAnimation: {transition: {duration: 200, curve: Easing.outBack}}
        }, options));

        const famousContext = Injection.get(FamousContext);
        this.router = Injection.get(Router);

        /* Hijack Famous Context's add() method */
        famousContext.add(this);

        this.router.on('routechange', this._onRouteChange);

        /* Add buttons dynamically */
        this.currentButtons = [];
        for (const index in this.options.buttons) {
            this.currentButtons.push(index);
            let button = this.options.buttons[index].button;
            button.options.clickEventName = `button${index}`;
            this.addRenderable(
                button,
                `button${index}`,
                ...this._getButtonDecorators(index)
            );
        }

        this._placeholderSurface = new Surface();

    }

    show(buttons = [0, 1]) {

        if (buttons === this.currentButtons) {
            return;
        }

        for (const index in this.options.buttons) {
            const buttonIndex = buttons[index];
            if (buttonIndex !== undefined) {
                if (this.currentButtons[index] !== buttonIndex) {
                    this._replaceButton(index, buttonIndex);
                } else if (this.getRenderableFlowState(`button${index}`) !== 'visible') {
                    this.setRenderableFlowState(`button${index}`, 'visible');
                }
            } else {
                this.replaceRenderable(`button${index}`, this._placeholderSurface);
                this.decorateRenderable(`button${index}`, ...this._getButtonDecorators(index));
                this.setRenderableFlowState(`button${index}`, 'invisible');
            }
        }

        this.currentButtons = buttons;
    }

    hideAll() {
        for (const index in this.options.buttons) {
            this.setRenderableFlowState(`button${index}`, 'invisible');
        }

        this.currentButtons = null;
    }

    _replaceButton(position, newButtonIndex) {
        this.replaceRenderable(`button${position}`, this.options.buttons[newButtonIndex].button);
        this.decorateRenderable(`button${position}`, ...this._getButtonDecorators(position));
        this.setRenderableFlowState(`button${position}`, 'visible');
    }

    _getButtonDecorators(index) {
        const commonLayout = [
            layout.stick.right(),
            flow.stateStep('visible', this.options.showAnimation, layout.opacity(1)),
            flow.defaultState('invisible', this.options.hideAnimation, layout.opacity(0))
        ];
        return index === '0'
            ? [
                layout.dock.bottom(64, 64),
                layout.size(64, 64),
                layout.translate(-16, -16, 8000),
                ...commonLayout
            ]
            : [
                layout.dock.bottom(48, index === '1' ? 32 : 16),
                layout.size(48, 48),
                layout.translate(-24, -0, 8000),
                ...commonLayout
            ];
    }

    _onRouteChange({controller, method}) {
        const paths = this.options.routes;

        /* Check if a controller + method path is set */
        const methodSpecificConfig = get(paths, `['${controller}']['${method}']`);

        /* Otherwise, check if a path was set for just the controller */
        const globalControllerConfig = get(paths, `['${controller}']`);

        /* Determine which tabs to show, if any, starting with the most specific ones */
        const config = methodSpecificConfig || (globalControllerConfig instanceof Array ? globalControllerConfig : null) || null;

        this.currentController = controller;

        if (config && config.length && config instanceof Array) {
            this.show(config);
        } else {
            this.hideAll();
        }
    }
}