/**
 * Created by manuel on 09-09-15.
 */
import isEqual                                          from 'lodash/isEqual.js';

import {Injection}                                      from 'arva-js/utils/Injection.js';
import {combineOptions}                                 from 'arva-js/utils/CombineOptions.js';
import {Router}                                         from 'arva-js/core/Router.js';

import {UIBar}                                          from '../../../uibars/UIBar.js';
import {InfoIcon}                                       from '../../../icons/InfoIcon.js';
import {UIBarTitle}                                     from '../../../text/UIBarTitle.js';
import {HamburgerIcon}                                  from '../../../icons/HamburgerIcon.js';
import {Clickable}                                      from '../../../components/Clickable.js';
import {UIBarIconButton}                                from '../../../buttons/UIBarIconButton.js';
import {StatusBarExtension}                             from '../../../utils/statusBar/StatusBarExtension.js';


export class TopMenu extends UIBar {

    /**
     * Top menu containing buttons with custom functionality
     *
     * @param {Object} options Construction options
     * @param {String} [options.defaultTitle] The default title to be displayed in the center of the TopMenu
     * @param {Boolean} [options.persistentButtons] Whether the topMenu buttons should persist on route change. E.g: if a certain Controller/Method has
     * specific buttons, change the buttons back to the previous buttons on route change.
     * @param {Object.Object.Object.Array} [options.dynamicButton] An option through which buttons can be customized per controller method.
     *                                     If clickEventName is not provided, will emit 'left', 'left2', 'left3' etc automatically.
     *          dynamicButtons: {
     *               'Home': {
     *                   'Index': {
     *                       left: [
     *                           new UIBarImageButton({clickEventName: 'left0', icon: AccountIcon})
     *                       ],
     *                       right: [
     *                           new UIBarImageButton({clickEventName: 'right0', icon: LeftIcon}),
     *                           new UIBarImageButton({clickEventName: 'right1', icon: LeftIcon})
     *                       ],
     *                       title: 'First Page',
     *                       persistentButtons: false,
     *                   },
     *                   'Edit': {
     *                       left: [
     *                           new UIBarImageButton({clickEventName: 'left0', icon: HamburgerIcon})
     *                       ],
     *                       right: [
     *                           new UIBarImageButton({clickEventName: 'right0', icon: LeftIcon}),
     *                           new UIBarImageButton({clickEventName: 'right1', icon: LeftIcon})
     *                       ],
     *                       title: 'First Page',
     *                       persistentButtons: false,
     *                   }
     *               }
     *           }
     */

    buttonsCache = {};
    persistentButtons = true;

    constructor(options = {}) {

        /* We have to do this because combineOptions merges arrays */
        if(!options.components){
            options.components = [
                [new UIBarTitle({
                    content: options.defaultTitle || '',
                    properties: {
                        cursor: 'default'
                    }
                }), 'title', 'center'],
                [options.rightButton || new UIBarIconButton({
                    clickEventName: 'rightButtonClick',
                    icon: InfoIcon
                }), 'rightButton', 'right'],
                [options.leftButton || new UIBarIconButton({
                    clickEventName: 'requestMenuOpen',
                    icon: HamburgerIcon,
                }), 'menuButton', 'left']
            ]
        }

        super(combineOptions({
            bottomLine: true,
        }, options));

        this.hamburgerButton = this.menuButton;

        this.router = Injection.get(Router);

        this.title.on('click', () => {
            this._eventOutput.emit('titleClick');
        });

        this.isOpen = false;

        if (window.StatusBar) {
            let color = this.options.colored ? this.options.backgroundProperties.backgroundColor : 'rgb(255, 255, 255)';
            Injection.get(StatusBarExtension).setColor(color);
        }

        this.cacheCurrentComponents();

        this.router.on('routechange', this.onRouteChange.bind(this));
    }

    cacheCurrentComponents() {
        this.buttonsCache = { left: this.getComponents('left'), right: this.getComponents('right') };
    }

    setCacheButtons() {
        this.buttonsCache && this.buttonsCache.left && this.removeComponents('left') && this.addComponents('left', this.buttonsCache.left);
        this.buttonsCache && this.buttonsCache.right && this.removeComponents('right') && this.addComponents('right', this.buttonsCache.right);
    }

    onRouteChange(route) {
        let { controller, method } = route;
        if (this.options.dynamicButtons
            && this.options.dynamicButtons[controller]
            && this.options.dynamicButtons[controller][method]) {
            let newComponents = this.options.dynamicButtons[controller][method];
            let { left, right, title } = newComponents;
            this._updateComponents(left, right, title);

            this.persistentButtons = this.options.dynamicButtons[controller][method].persistentButtons;
        } else {
            if (!this.persistentButtons) {
                this.setCacheButtons();
            } else {
                this.cacheCurrentComponents();
            }
            this.persistentButtons = true;
        }
    }

    async open() {
        if (!this.isOpen) {
            this.isOpen = true;
        }
    }

    async close() {
        if (this.isOpen) {
            this.isOpen = false;
        }
    }

    setTitle(newTitle) {
        return this.title.setContent(newTitle);
    }

    getTitle() {
        return this.title.getContent();
    }

    setRightButton(newButton) {
        this.replaceRenderable('rightButton', newButton);
    }

    /**
     * @deprecated
     * */
    async setTemporaryLeftButton(leftButton) {
        this._eventOutput.emit('requestMenuClose');
        await this.removeComponents('left');
        this.addComponent(leftButton, 'menuButton', 'left');
    }

    /**
     * @deprecated
     * */
    removeTemporaryLeftButton() {
        this.removeComponents('left');
        this.addComponent(this.isOpen ? this.arrowLeftButton : this.hamburgerButton, 'menuButton', 'left');
    }

    _updateComponents(left, right, title) {
        this._updateComponentsOnSide(left, 'left');
        this._updateComponentsOnSide(right, 'right');

        let centerComponents = this.getComponents('center');
        let currentTitle = centerComponents && centerComponents.length ? centerComponents[0] : '';
        if (title !== currentTitle) {
            this.setTitle(title || '');
        }
    }

    _updateComponentsOnSide(components, side) {
        if (!isEqual(components, this.getComponents(side))) {
            this.removeComponents(side);
            if (components) {
                this.addComponents(side, components);
                this._setClickEventNames(side, components);
            }
        }
    }

    /**
     * Sets component's clickEventName option to left, left2, left3, right, right2, etc, if it is a Clickable
     * that does not have a special clickEventName already set.
     * @param {Array} components List of components, as accepted by UIBar.
     * @param {String} location One of the following: 'left', 'right', 'title'
     * @private
     */
    _setClickEventNames(location, components) {
        for(let index = 0; index < components.length; index++) {
            let component = components[index];
            if(component instanceof Clickable && component.options.clickEventName === 'buttonClick') {
                component.options.clickEventName = `${location}${index > 0 ? index+1 : ''}`;
            }
        }
    }

}
