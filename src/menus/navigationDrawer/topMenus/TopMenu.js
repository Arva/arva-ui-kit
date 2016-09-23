/**
 * Created by manuel on 09-09-15.
 */

import Surface                  from 'famous/core/Surface.js';
import Timer                    from 'famous/utilities/Timer.js';

import {View}                   from 'arva-js/core/View.js';
import {layout}                 from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';

import {Text}                   from '../../../text/Text.js';
import {Colors}                 from '../../../defaults/DefaultColors.js';
import {Dimensions}             from '../../../defaults/DefaultDimensions.js';
import {LeftIcon}               from '../../../icons/LeftIcon.js';
import {HamburgerIcon}          from '../../../icons/HamburgerIcon.js';
import {InfoIcon}               from '../../../icons/InfoIcon.js';
import {ImageButton}            from '../../../buttons/ImageButton.js';
import {FloatingImageButton}    from '../../../buttons/FloatingImageButton.js';
import {UIBarImageButton}       from '../../../buttons/UIBarImageButton.js';
import {UIBar}                  from '../../../uibars/UIBar.js';
import {UITitle}                from '../../../text/UITitle.js';


export class TopMenu extends UIBar {

    @layout.animate()
    @layout.size(true, true)
    @layout.stick.center()
    @layout.dock.left()
    @layout.translate(0, 0, 40)
    /* Getter will be overwritten by the decorators, so won't be called twice */
    get menuButton() {
        this.hamburgerButton = new UIBarImageButton({
            clickEventName: 'requestMenuOpen',
            icon: HamburgerIcon,
        });
        this.arrowLeftButton = new UIBarImageButton({
            clickEventName: 'requestMenuClose',
            icon: LeftIcon
        });
        return this.hamburgerButton;
    }

    /*@layout.size(65, Dimensions.topBarHeight)
    @layout.align(0, 0)
    @layout.origin(0, 0)
    @layout.translate(0, 0, 100)
    clickableSurface = new Surface();*/

    @layout.dock.right()
    @layout.size(true, ~100)
    @layout.stick.center()
    @layout.translate(0, 0, 25)
    rightButton = this.options.rightButton || new FloatingImageButton({
        clickEventName: 'rightButtonClick', icon: InfoIcon,
        properties: {color: Colors.UIBarTextColor},
        variation: 'noShadow',
        makeRipple: false,
        indicatePress: true,
        backgroundProperties: {borderRadius: 0}
    });

    constructor(options = {}) {
        super(combineOptions({
            components: [
                [new UITitle({content: options.defaultTitle || ''}), 'title', 'center']
            ]
        }, options));


        this.title.on('click', () => {
            this._eventOutput.emit('titleClick');
        });


        this.isOpen = false;
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
