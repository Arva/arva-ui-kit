/**
 * Created by manuel on 09-09-15.
 */
import {Injection}                                      from 'arva-js/utils/Injection.js';
import {combineOptions}                                 from 'arva-js/utils/CombineOptions.js';
import {Router}                                         from 'arva-js/core/Router.js';

import {UIBar}                                          from '../../../uibars/UIBar.js';
import {InfoIcon}                                       from '../../../icons/InfoIcon.js';
import {UIBarTitle}                                     from '../../../text/UIBarTitle.js';
import {HamburgerIcon}                                  from '../../../icons/HamburgerIcon.js';
import {Clickable}                                      from '../../../components/Clickable.js';
import {UIBarImageButton}                               from '../../../buttons/UIBarImageButton.js';
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
        super(combineOptions({
            bottomLine: true,
            components: [
                [new UIBarTitle({ content: options.defaultTitle || '' }), 'title', 'center'],
                [options.rightButton || new UIBarImageButton({
                    clickEventName: 'rightButtonClick',
                    icon: InfoIcon
                }), 'rightButton', 'right'],
                [new UIBarImageButton({
                    clickEventName: 'requestMenuOpen',
                    icon: HamburgerIcon,
                }), 'menuButton', 'left']
            ]
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

        this.router.on('routechange', this.onRouteChange);
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
            if (newComponents && (left || right)) {
                this.removeComponents('right');
                this.removeComponents('left');
                if (left) {
                    this.addComponents('left', left);
                    this._setClickEventNames('left', left);
                }
                if (right) {
                    this.addComponents('right', right);
                    this._setClickEventNames('right', right);
                }
                if (title) {
                    this.setTitle(title);
                }
            }
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
