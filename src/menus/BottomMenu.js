import {View}                   from 'arva-js/core/View.js';
import {layout, flow}           from 'arva-js/layout/Decorators.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {Injection}              from 'arva-js/utils/Injection.js';

import {Router}                 from 'arva-js/core/Router.js';

import {FloatingIconButton}     from '../buttons/FloatingIconButton.js';
import {HamburgerIcon}          from '../icons/HamburgerIcon.js';
import {CrossIcon}              from '../icons/CrossIcon.js'
import {IconTextButton}         from '../buttons/IconTextButton.js';
import {Colors, Gray}           from '../defaults/DefaultColors.js';

import FamousContext            from 'famous/core/Context.js';
import Surface                  from 'famous/core/Surface.js';
import * as Easing              from 'famous/transitions/Easing.js';

/*
- spacing left too wide
 */

/**
 * A collapsible bottom menu toggled with a floating icon
 *
 * @param {Object} options Construction options
 * @param {String} [options.menuButton.closedIcon] Icon to use in button on closed state
 * @param {String} [options.menuButton.openIcon] Icon to use in button on open state
 * @parmas {Array} [options.hideOnRoutes] List of Controller / Methods to hide the menu button
 **/

const animationOptions = {
    transition: {
        curve: Easing.outCubic,
        duration: 200
    }
};

export class BottomMenu extends View {

    @layout.fullSize()
    @layout.translate(0, 0, 400)
    @flow.defaultState('hidden', animationOptions, layout.opacity(0))
    @flow.stateStep('shown', animationOptions, layout.opacity(0.40))
    screenBackdrop = new Surface({
        properties:{
            backgroundColor: "black",
            pointerEvents: "none"
        }
    });

    @layout.translate(-15,-15,1500)
    @layout.animate({})
    @layout.stick.bottomRight()
    @layout.size(64, 64)
    menuButton = this._createMenuButton();

    @flow.stateStep('shown', animationOptions, layout.translate(0, 0, 500))
    @layout.dock.bottom()
    @layout.size(undefined, true)
    menu = new VerticalMenu();

    constructor(options = {}){
        super(combineOptions({
            menuButton: {
                closedIcon: HamburgerIcon,
                openIcon: CrossIcon,
            },
        }, options));

        let famousContext = Injection.get(FamousContext);
        this.router = Injection.get(Router);

        this.router.on('routechange', this._onRouteChange.bind(this));
        famousContext.add(this);
        this.menu._init(this.options);
        this._eventInput.on('menuItemClick', this._handleMenuItemClick.bind(this));

        this.menuHeight = (this.options.menuItems.length + 1) * menuHeight;
        this.open = false;
        this.buttonHidden = false;

        this.decorateRenderable('menu', flow.defaultState('hidden', animationOptions, layout.translate(0, this.menuHeight, 500)))
    }

    resetButtonColor(color){
        this.menuButton.background.setProperties({
            backgroundColor: color
        });
    }

    _handleMenuItemClick({controller, method}){
        let { controller: presentController, method: presentMethod } = this.router.getRoute();
        if (presentController !== controller || presentMethod !== method){
            this.router.go(controller, method);
        }
        this.toggleMenu()
    }

    _onRouteChange({ controller, method = 'Index' }){
        this._setActiveMenuItemFromRoute(controller, method);
        if (this._shouldHideButtonOnRoute(controller, method)){
            this._hideButton()
        } else {
            this._showButton()
        }
    }

    _showButton(){
        if (!this.buttonHidden) return;
        this.showRenderable('menuButton');
        this.buttonHidden = false;
    }

    _hideButton(){
        if (this.buttonHidden) return;
        this.hideRenderable('menuButton');
        this.buttonHidden = true;
    }

    _shouldHideButtonOnRoute(controller, method){
        let shouldHideButton = this.options.hideOnRoutes.some( route => {
            if (!route.method) {
                return route.controller === controller
            } else {
                return route.controller === controller && route.method === method
            }
        });

        return shouldHideButton;
    }

    _setActiveMenuItemFromRoute(controller, method){
        let idx = this.options.menuItems.findIndex(item => {
            return item.controller === controller && item.method === method
        });
        if (idx !== -1){
            this.menu.setActiveItem(idx)
        }
    }

    _createMenuButton(){
        let {closedIcon, openIcon} = this.options.menuButton;
        let button = new FloatingIconButton({
            icon: closedIcon,
            imageSize: [24,24],
        });

        button.on('click', this.toggleMenu.bind(this));

        return button
    }

    _showOpenButton() {
        this.menuButton.setContent(this.options.menuButton.openIcon)
    }

    _showClosedButton(){
        this.menuButton.setContent(this.options.menuButton.closedIcon)
    }


    _showMenuRenderables(){
        this.setRenderableFlowState('menu', 'shown');
        this.setRenderableFlowState('background', 'shown')
    }

    _hideMenuRenderables(){
        this.setRenderableFlowState('menu', 'hidden');
        this.setRenderableFlowState('background', 'hidden')
    }

    toggleMenu(){
        if (this.open){
            this._hideMenuRenderables();
            this._showClosedButton();
        } else {
            this._showMenuRenderables();
            this._showOpenButton();
        }
        this.open = !this.open;
    }

}


const menuHeight = 64;

class VerticalMenu extends View {

    @layout.fullSize()
    @layout.translate(0, 0, 500)
    background = new Surface({
        properties: {
            backgroundColor: "white",
            zIndex: 500
        },
        attributes: {
            test: true
        }
    });

    constructor(options){
        super(options);
        this.menuItems = [];
    }

    _init(options){
        let menuItems = options.menuItems || [];
        menuItems.forEach( (item, idx) => {
            let content = new MenuRow({
                content: item.text,
                icon: item.icon,
                iconProperties: {
                    height: 24,
                    width: 24,
                    color: Gray,
                },
                properties: {
                    color: Gray
                },
                useBoxShadow: false
            });

            content.on('click', () => {
                this._eventOutput.emit('menuItemClick', item)
            });

            this.menuItems.push(content);
            content.decorateRenderable('iconAndText', layout.dock.left());
            this.addRenderable(content, `menuItem-${idx}`, layout.dock.top(), layout.size(undefined, menuHeight), layout.dockPadding(36), layout.translate(0,0,500));
            if (idx !== menuItems.length - 1){
                let bar = new Surface({
                    properties: {
                        backgroundColor: "black",
                    }
                });
                this.addRenderable(bar, `${item.text}-bar`, layout.dock.top(), layout.size(window.innerWidth - 32, 1), layout.opacity(0.1), layout.translate(16, 0, 600))
            }
        });

    }

    setActiveItem(idx){
        if (typeof this.activeIdx === 'number'){
            this._clearActiveItem()
        }
        this.menuItems[idx].setColor(Colors.PrimaryUIColor);
        this.activeIdx = idx
    }
    _clearActiveItem(){
        this.menuItems[this.activeIdx].setColor(Gray)
    }
}

class MenuRow extends IconTextButton {
    constructor(options){
        super(options)
    }
    setColor(color){
        this.iconAndText.text.setProperties({
            color
        });

        this.iconAndText.icon.changeColor(color)
    }
}