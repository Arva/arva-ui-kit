/**
 * Created by manuel on 09-09-15.
 */
import Surface                  from 'famous/core/Surface.js';
import AnimationController      from 'famous-flex/AnimationController.js';
import {View}                   from 'arva-js/core/View.js';
import {NameDisplay}            from './NameDisplay.js';
import {layout}                 from 'arva-js/layout/decorators.js';
import {Text}                   from '../../../surfaces/text/Text.js';
import {Colors}                 from '../../../defaults/DefaultColors.js';
import {Dimensions}             from '../../../defaults/DefaultDimensions.js';

import {ArrowleftIcon}          from '../../../icons/angular/bold/ArrowleftIcon.js';
import {HamburgerIcon}          from '../../../icons/angular/bold/HamburgerIcon.js';
import {InfoIcon}               from '../../../icons/angular/bold/InfoIcon.js';
import {ImageButton}            from '../../../components/buttons/ImageButton.js';

import {UITitle}                from '../../../defaults/DefaultTypefaces.js';

@layout.margins([0, 0, 0, 18])
export class TopMenuView extends View {

    @layout.size(~100, ~17)
    @layout.place('center')
    @layout.translate(0, 0, 25)
    title = new Text({
        content: this.options.defaultTitle || 'Mijn dashboard',
        properties: {
            color: Colors.UIBarTextColor,
            fontSize: UITitle.fontSize,
            fontFamily: UITitle.fontFamily,
            textAlign: 'center',
            fontWeight: 'bold'
        }

    });

    @layout.dock('right')
    @layout.size(50, (size) => Math.min(size, 100))
    @layout.align(0.5,0.5)
    @layout.origin(0.5,0.5)
    @layout.translate(0, 0, 25)
    rightButton = new ImageButton({clickEventName: 'rightButtonClick', alwaysEnabled: true, properties: {color: 'white'}, icon:InfoIcon, imageOnly: true});

    @layout.animate({showInitially: false})
    @layout.size(~300, undefined)
    @layout.dock('right')
    @layout.translate(0, 0, 25)
    nameDisplay = new NameDisplay();

    @layout.size(26.88, 22)
    @layout.place('left')
    @layout.dock('left')
    @layout.translate(0, 0, 20)
    menuButton = new AnimationController();

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


    @layout.fullscreen
    background = new Surface({
        properties: {
            'background-color': Colors.PrimaryUIColor
        }
    });

    constructor(options = {}) {
        super(options);

        this.hamburgerButton = new HamburgerIcon({
            properties: {
                cursor: 'pointer'
            }
        });

        this.backButton = new ArrowleftIcon({
            properties: {
                cursor: 'pointer'
            }
        });

        this.clickableSurface.on('click', () => {
            if (this.menuButton.get() === this.hamburgerButton) {
                this._eventOutput.emit('requestMenuOpen');
            } else {
                this._eventOutput.emit('requestMenuClose');
            }
        });

        this.menuButton.show(this.hamburgerButton);

        this.hamburgerButton.pipe(this.menuButton._eventOutput);
        this.backButton.pipe(this.menuButton._eventOutput);
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
        this.isOpen = true;
        this.menuButton.show(this.backButton, ...arguments);
    }

    /**
     * Close the top menu
     */
    close() {
        this.isOpen = false;
        this.menuButton.show(this.hamburgerButton, ...arguments);
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