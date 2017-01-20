/**
 * Created by manuel on 09-09-15.
 */
import {Injection}                                      from 'arva-js/utils/Injection.js';
import {layout}                                         from 'arva-js/layout/Decorators.js';
import {combineOptions}                                 from 'arva-js/utils/CombineOptions.js';
import {Router}                                         from 'arva-js/core/Router.js';
import {UIBar}                                          from '../../../uibars/UIBar.js';
import {UIBarTitle}                                     from '../../../text/UIBarTitle.js';
import {LeftIcon}                                       from '../../../icons/LeftIcon.js';
import {InfoIcon}                                       from '../../../icons/InfoIcon.js';
import {HamburgerIcon}                                  from '../../../icons/HamburgerIcon.js';
import {UIBarImageButton}                               from '../../../buttons/UIBarImageButton.js';
import {StatusBarExtension}                             from '../../../utils/statusBar/StatusBarExtension.js';


export class TopMenu extends UIBar {

    /**
     * Top menu containing buttons with custom functionality
     *
     * @param {Object} options Construction options
     * @param {String} [options.defaultTitle] The default title to be displayed in the center of the TopMenu
     * @param {Object.Object.Object.Array} [options.dynamicButton] An option through which buttons can be customized per controller method.
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
     *                       title: 'First Page'
     *                   },
     *                   'Edit': {
     *                       left: [
     *                           new UIBarImageButton({clickEventName: 'left0', icon: HamburgerIcon})
     *                       ],
     *                       right: [
     *                           new UIBarImageButton({clickEventName: 'right0', icon: LeftIcon}),
     *                           new UIBarImageButton({clickEventName: 'right1', icon: LeftIcon})
     *                       ],
     *                       title: 'First Page'
     *                   }
     *               }
     *           }
     */
    constructor(options = {}) {
        super(combineOptions({
            components: [
                [new UIBarTitle({content: options.defaultTitle || ''}), 'title', 'center'],
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
        this.arrowLeftButton = new UIBarImageButton({
            clickEventName: 'requestMenuClose',
            icon: LeftIcon
        });

        this.router = Injection.get(Router);

        this.title.on('click', () => {
            this._eventOutput.emit('titleClick');
        });


        this.isOpen = false;

        if (window.StatusBar) {
            let color = this.options.colored ? this.options.backgroundProperties.backgroundColor : 'rgb(255, 255, 255)';
            Injection.get(StatusBarExtension).setColor(color);
        }

        this.router.on('routechange', this.onRouteChange);
    }

    onRouteChange(route) {
        let {controller, method} = route;
        if (this.options.dynamicButtons
            && this.options.dynamicButtons[controller]
            && this.options.dynamicButtons[controller][method]) {
            let newComponents = this.options.dynamicButtons[controller][method];
            let {left, right, title} = newComponents;
            if (newComponents) {
                this.removeComponents('left');
                this.removeComponents('right');
                if (left) {
                    this.addComponents('left', left);
                }
                if (right) {
                    this.addComponents('right', right);
                }
                if (title) {
                    this.setTitle(title);
                }
            }
        }
    }

    async open() {
        if (!this.isOpen) {
            this.isOpen = true;
            await this.hideRenderable('menuButton');
            this.removeComponents('left');
            this.addComponent(this.arrowLeftButton, 'menuButton', 'left');
        }
    }

    async close() {
        if (this.isOpen) {
            this.isOpen = false;
            await this.hideRenderable('menuButton');
            this.removeComponents('left');
            this.addComponent(this.hamburgerButton, 'menuButton', 'left');
        }
    }

    setTitle(newTitle) {
        return this.title.setContent(newTitle);
    }

    getTitle() {
        return this.title.getContent();
    }

    setRightButton(newButton){
        this.replaceRenderable('rightButton', newButton);
    }

    async setTemporaryLeftButton(leftButton) {
        this._eventOutput.emit('requestMenuClose');
        await this.removeComponents('left');
        this.addComponent(leftButton, 'menuButton', 'left');
    }

    removeTemporaryLeftButton() {
        this.removeComponents('left');
        this.addComponent(this.isOpen ? this.arrowLeftButton : this.hamburgerButton, 'menuButton', 'left');
    }

}
