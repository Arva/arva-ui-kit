/**
 * Created by manuel on 09-09-15.
 */
import {Injection} from 'arva-js/utils/Injection.js';
import {layout} from 'arva-js/layout/Decorators.js';
import {combineOptions} from 'arva-js/utils/CombineOptions.js';
import {Router} from 'arva-js/core/Router.js';
import {UIBar} from '../../../uibars/UIBar.js';
import {UIBarTitle} from '../../../text/UIBarTitle.js';
import {LeftIcon} from '../../../icons/LeftIcon.js';
import {InfoIcon} from '../../../icons/InfoIcon.js';
import {HamburgerIcon} from '../../../icons/HamburgerIcon.js';
import {UIBarImageButton} from '../../../buttons/UIBarImageButton.js';
import {StatusBarExtension} from '../../../utils/statusBar/StatusBarExtension.js';


export class TopMenu extends UIBar {

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

        this.rightButton.setVariation(this.options.variation);

        this.router = Injection.get(Router);

        this.title.on('click', () => {
            this._eventOutput.emit('titleClick');
        });


        this.isOpen = false;

        if (window.StatusBar) {
            let color = this.options.colored ? this.options.backgroundProperties.backgroundColor : 'rgb(255, 255, 255)';
            Injection.get(StatusBarExtension).setColor(color);
        }

        // this.removeComponents('left');

        this.router.on('routechange', this.onRouteChange);
    }

    onRouteChange(route) {
        let controller = route.controller;
        if (this.options.dynamicButtons && this.options.dynamicButtons[controller]) {
            let {left, right} = this.options.dynamicButtons[controller];
            if (left || right) {
                this.removeAllComponents();
                if (left) {
                    this.addComponents('left', left);
                }
                if (right) {
                    this.addComponents('right', right);
                }
            }
        }
    }

    open() {
        if (!this.isOpen) {
            this.isOpen = true;
            this.removeComponents('left');
            this.addComponent(this.arrowLeftButton, 'menuButton', 'left');
        }
    }

    close() {
        if (this.isOpen) {
            this.isOpen = false;
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
