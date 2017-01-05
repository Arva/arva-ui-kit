/**
 * Created by manuel on 09-09-15.
 */

import AnimationController      from 'famous-flex/AnimationController.js';

import {Injection}              from 'arva-js/utils/Injection.js';
import {layout}                 from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';

import {UIBar}                  from '../../../uibars/UIBar.js';
import {UIBarTitle}             from '../../../text/UIBarTitle.js';
import {LeftIcon}               from '../../../icons/LeftIcon.js';
import {InfoIcon}               from '../../../icons/InfoIcon.js';
import {HamburgerIcon}          from '../../../icons/HamburgerIcon.js';
import {UIBarImageButton}       from '../../../buttons/UIBarImageButton.js';
import {StatusBarExtension}     from '../../../utils/statusBar/StatusBarExtension.js';


export class TopMenu extends UIBar {

    @layout.animate({animation: AnimationController.Animation.Fade})
    @layout.size(true, true)
    @layout.stick.center()
    @layout.dock.left()
    @layout.translate(0, 0, 40)
    /* Getter will be overwritten by the decorators, so won't be called twice */
    get menuButton() {
        this.hamburgerButton = new UIBarImageButton({
            clickEventName: 'requestMenuOpen',
            icon: HamburgerIcon
        });
        this.hamburgerButton.setVariation(this.options.variation);
        this.arrowLeftButton = new UIBarImageButton({
            clickEventName: 'requestMenuClose',
            icon: LeftIcon
        });
        this.arrowLeftButton.setVariation(this.options.variation);
        return this.hamburgerButton;
    }

    @layout.dock.right()
    @layout.size(true, ~100)
    @layout.stick.center()
    @layout.translate(0, 0, 25)
    rightButton = this.options.rightButton || new UIBarImageButton({
        clickEventName: 'rightButtonClick', icon: InfoIcon
    });

    constructor(options = {}) {
        super(combineOptions({
            components: [
                [new UIBarTitle({content: options.defaultTitle || ''}), 'title', 'center']
            ]
        }, options));

        this.rightButton.setVariation(this.options.variation);

        this.title.on('click', () => {
            this._eventOutput.emit('titleClick');
        });


        this.isOpen = false;

        if (window.StatusBar) {
            let color = this.options.colored ? this.options.backgroundProperties.backgroundColor : 'rgb(255, 255, 255)';
            Injection.get(StatusBarExtension).setColor(color);
        }
    }



    open() {
        if (!this.isOpen) {
            this.isOpen = true;
            this.replaceRenderable('menuButton', this.arrowLeftButton);
            this.showRenderable('menuButton');
        }
    }

    close() {
        if (this.isOpen) {
            this.isOpen = false;
            this.replaceRenderable('menuButton', this.hamburgerButton);
            this.showRenderable('menuButton');
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
        await this.hideRenderable('menuButton');
        this.replaceRenderable('menuButton', leftButton);
        this.showRenderable('menuButton');
    }

    removeTemporaryLeftButton() {
        this.replaceRenderable('menuButton', this.isOpen ? this.arrowLeftButton : this.hamburgerButton);
        this.showRenderable('menuButton');
    }


}
