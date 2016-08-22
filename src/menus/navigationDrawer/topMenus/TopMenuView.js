/**
 * Created by manuel on 09-09-15.
 */
import Surface                  from 'famous/core/Surface.js';
import {View}                   from 'arva-js/core/View.js';
import {NameDisplay}            from './NameDisplay.js';
import {layout}                 from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {Text}                   from '../../../text/Text.js';
import {Colors}                 from '../../../defaults/DefaultColors.js';
import {Dimensions}             from '../../../defaults/DefaultDimensions.js';

import {ArrowleftIcon}          from '../../../icons/ArrowleftIcon.js';
import {HamburgerIcon}          from '../../../icons/HamburgerIcon.js';
import {InfoIcon}               from '../../../icons/InfoIcon.js';
import {ImageButton}            from '../../../buttons/ImageButton.js';
import {FloatingImageButton}    from '../../../buttons/FloatingImageButton.js';

import {UITitle}                from '../../../defaults/DefaultTypefaces.js';

@layout.dockPadding(0, 0, 0, 5)
export class TopMenuView extends View {

    @layout.size(~100, ~17)
    @layout.stick.center()
    @layout.translate(0, 0, 25)
    title = new Text(combineOptions(UITitle, {
        content: this.options.defaultTitle || 'Dashboard',
        properties: {
            color: Colors.UIBarTextColor,
            textAlign: 'center'
        }
    }));

    @layout.dock.right()
    @layout.size(50, (_, height) => Math.min(height, 100))
    @layout.stick.center()
    @layout.translate(0, 0, 25)
    rightButton = new FloatingImageButton({
        clickEventName: 'rightButtonClick', icon: InfoIcon,
        properties: {color: Colors.UIBarTextColor},
        variation: 'noShadow',
        makeRipple: false,
        indicatePress: true,
        backgroundProperties: {borderRadius: 0}
    });

    @layout.animate({showInitially: false})
    @layout.size(~300, undefined)
    @layout.dock.right()
    @layout.translate(0, 0, 25)
    nameDisplay = new NameDisplay();

    @layout.animate()
    @layout.size(50, (_, height) => Math.min(height, 100))
    @layout.stick.center()
    @layout.dock.left()
    @layout.translate(0, 0, 20)
    /* Getter will be overwritten by the decorators, so won't be called twice */
    get menuButton() {
        this.hamburgerButton = new ImageButton({
            clickEventName: 'requestMenuOpen',
            imageOnly: true,
            icon: HamburgerIcon,
            properties: {color: Colors.UIBarTextColor},
            variation: 'noShadow',
            makeRipple: false,
            indicatePress: true,
            backgroundProperties: {borderRadius: 0}
        });
        this.arrowLeftButton = new ImageButton({
            clickEventName: 'requestMenuClose',
            imageOnly: true,
            icon: ArrowleftIcon,
            properties: {color: Colors.UIBarTextColor},
            variation: 'noShadow',
            makeRipple: false,
            indicatePress: true,
            backgroundProperties: {borderRadius: 0}
        });
        return this.hamburgerButton;
    }

    @layout.size(65, Dimensions.topBarHeight)
    @layout.align(0, 0)
    @layout.origin(0, 0)
    @layout.translate(0, 0, 40)
    clickableSurface = new Surface();

    @layout.size(65, Dimensions.topBarHeight)
    @layout.align(1, 0)
    @layout.origin(1, 0)
    @layout.translate(0, 0, 40)
    clickableRightButtonSurface = new Surface();


    @layout.fullSize()
    background = new Surface({
        properties: {
            'background-color': Colors.PrimaryUIColor
        }
    });

    constructor(options = {}) {
        super(options);


        this.clickableSurface.on('click', () => {
            if (this.renderables.menuButton.get().options.icon === HamburgerIcon) {
                this._eventOutput.emit('requestMenuOpen');
            } else {
                this._eventOutput.emit('requestMenuClose');
            }
        });


        this.title.on('click', () => {
            this._eventOutput.emit('titleClick');
        });
        this.clickableRightButtonSurface.on('click', () => {
            this._eventOutput.emit('rightButtonClick');
        });

        this._userNameEnabled = true;

        this.layouts.push(() => {
            if (window.isTablet && this._userNameEnabled) {
                if (!this.renderables.nameDisplay.get()) {
                    this.renderables.nameDisplay.show(this.nameDisplay);
                }
            }
            else {
                this.renderables.nameDisplay.hide();
            }
        });
    }

    /**
     * Set a new userName
     */
    setNewUser() {
        this.nameDisplay.updateUser();
    }

    /**
     * Enable the userName and display the username
     * @param enabled
     */
    setUserNameEnabled(enabled) {
        this._userNameEnabled = enabled;
        this.layout.reflowLayout();
    }

    /**
     * Set the colors of the menuBar
     * @param colors
     */
    setColors(colors) {
        let {MenuBackgroundColor = Colors.SecondaryUIColor} = colors;
        this.background.setProperties({backgroundColor: MenuBackgroundColor});
        this.title.setProperties({properties: {color: colors.TitleBarTextColor || Colors.UIBarTextColor}});
        if (window.StatusBar) {
            window.StatusBar.backgroundColorByHexString(MenuBackgroundColor);
        }
    }

    /**
     * Open the top menu
     */
    open() {
        if (!this.isOpen) {
            this.isOpen = true;
            this.replaceRenderable('menuButton', this.arrowLeftButton);
            this.showRenderable('menuButton');
        }
    }

    /**
     * Close the top menu
     */
    close() {
        if (this.isOpen) {
            this.isOpen = false;
            this.replaceRenderable('menuButton', this.hamburgerButton);
            this.showRenderable('menuButton');
        }

    }

    /**
     * Set the right button's icon
     * @param button
     */
    setRightButton(button = InfoIcon) {
        this.rightButton.setContent(button);
    }

    /**
     * Get the top menu's title
     * @returns {String|string}
     */
    getTitle() {
        return this.title.getContent();
    }

    /**
     * Set the top menu's title
     * @param text
     */
    setTitle(text = '') {
        this.title.setContent(text);
    }
}