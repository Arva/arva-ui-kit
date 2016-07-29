/**
 * Created by manuel on 09-09-15.
 */
import Surface                  from 'famous/core/Surface.js';
import TabBar                   from 'famous-flex/widgets/TabBar.js';

import {View}                   from 'arva-js/core/View.js';
import {Router}                 from 'arva-js/core/Router.js';
import {Injection}              from 'arva-js/utils/Injection.js';

import AnimationController      from 'famous-flex/AnimationController';
import RenderNode               from 'famous/core/RenderNode';
import Easing                   from 'famous/transitions/Easing';
import Draggable                from 'famous/modifiers/Draggable';
import StateModifier            from 'famous/modifiers/StateModifier';
import {DraggableSideMenuView}  from './DraggableSideMenuView.js';
import {FullScreenBackground}   from '../../../backgrounds/FullScreenBackground.js';
import {Colors}                 from '../../../defaults/DefaultColors.js';

export class DraggableSideMenu extends View {


    static get transition(){
        return {duration: 200, curve: Easing.inOutQuad}
    }

    constructor(options = {}) {
        super(options);

        this.toggle = false;
        this.direction = true;
        this.router = Injection.get(Router);
    }

    /**
     *
     * @param options
     */
    setData(options) {
        this.initialised = true;
        this.options = options;
        this._createRenderables(options);
        this._createListeners();
    }

    /**
     * Open the sideMenu
     */
    open() {
        if (window.cordova.plugins && window.cordova.plugins.Keyboard) {
            window.cordova.plugins.Keyboard.close();
        }

        if (this.draggable) {
            this.draggable.setPosition([this.controlWidth, 0, 0], {duration: 250, curve: Easing.outQuint});
            this.ShowSideBar();
        }

        this._eventOutput.emit('open');
    }

    /**
     * Close the sideMenu
     */
    close() {
        let trans = {
            method: 'snap',
            period: 1,
            dampingRatio: 0,
            velocity: 0
        };

        if (this.draggable) {
            this.draggable.setPosition([0, 0, 0], {duration: 250, curve: Easing.outQuint});
            this._hideSideBar();
        }

        this._eventOutput.emit('close');
    }

    /**
     *
     * @param options
     * @private
     */
    _createRenderables(options) {
        options.colors = options.colors || {
                MenuBackgroundColor: Colors.PrimaryUIColor,
                MenuTextColor: Colors.UIBarTextColor,
                MenuTextColorHighlight: Colors.UIBarTextColor,
                TitleBarColor: Colors.UIBarTextColor,
                MenuBackgroundHighLightColor: Colors.SecondaryUIColor
            };

        this.renderables.sideMenuView = new AnimationController({
            show: {
                transition: {duration: 500, curve: Easing.inOutQuint},
                animation: AnimationController.Animation.Slide.Right
            },
            hide: {
                transition: {duration: 500, curve: Easing.inOutQuint},
                animation: AnimationController.Animation.Slide.Left
            }
        });

        this.renderables.fullScreenOverlay = new AnimationController({
            show: {
                transition: {duration: 0, curve: Easing.inOutQuint},
                animation: AnimationController.Animation.Slide.Right
            },
            hide: {
                transition: {duration: 0, curve: Easing.inOutQuint},
                animation: AnimationController.Animation.Slide.Left
            }
        });
        this.fullScreenOverlayNode = new RenderNode();
        this.fullScreenOverlayModifier = new StateModifier({opacity:0});

        this.fullScreenOverlay = new FullScreenBackground({color: 'rgba(0, 0, 0, 0.25)'});

        this.fullScreenOverlayNode.add(this.fullScreenOverlayModifier).add(this.fullScreenOverlay);

        this.sideMenuView = this.options.draggableSideMenuViewRenderable ? new this.options.draggableSideMenuViewRenderable(options) : new DraggableSideMenuView(options);
        this.maxRange = 200; /* Gets set properly after 1 render tick, by layout function below. */

        /* Hidden draggable renderable for opening the sidebar menu */
        this.draggable = new Draggable({
            snapY: 0,
            snapX: 1,
            xRange: [0, this.maxRange],
            yRange: [0, 0]
        });

        this.draggable.pipe(this);
        this.draggable.pipe(this._eventOutput);

        this.hiddenSurface = new Surface({
            properties: {
                'background-color': 'transparent'
            }
        });

        /* Draggable hidden Surface */
        let hiddenSurfaceMod = new StateModifier();
        let hiddenSurfaceNode = new RenderNode();
        hiddenSurfaceNode.add(hiddenSurfaceMod).add(this.draggable).add(this.hiddenSurface);

        this.renderables.hiddenSurface = hiddenSurfaceNode;
        this.hiddenSurface.pipe(this.draggable);

        let mod = new StateModifier();
        let dragNode = new RenderNode();
        dragNode.add(mod).add(this.draggable).add(this.sideMenuView);
        this.renderables.control = dragNode;

        this.sideMenuView.pipe(this.draggable);
        // this.fullScreenOverlay.pipe(this.draggable);

        this.draggable.on('end', (dragEvent) => {
            if (this.direction) {
                (dragEvent.position[0] < this.controlWidth / 3) ? this.close() : this.open();
            } else {
                (dragEvent.position[0] > this.controlWidth * (2 / 3)) ? this.open() : this.close();
            }

        });

        this.draggable.on('update', (dragEvent)=> {
            this.renderables.fullScreenOverlay.show(this.fullScreenOverlayNode);
            this.fullScreenOverlayModifier.setOpacity(dragEvent.position[0]/this.controlWidth);
            this.direction = (dragEvent.position[0] > this.lastPosition);
            this.lastPosition = dragEvent.position[0];
        });

        this.setTabIndexSelected(0);
        this.layout.reflowLayout();

        this.layouts.push((context) => {

            /* value | 0 makes value an integer, if it is a float */
            this.controlWidth = Math.min(320, context.size[0] * ( options.width || 0.75 )) | 0;

            /* Update xRange of draggable, as context is now defined */
            this.draggable.setOptions({
                xRange: [0, this.controlWidth]
            });


            //TODO: replace window.size things with proper definitions
            context.set('control', {
                size: [this.controlWidth, undefined],
                origin: [0, 0],
                align: [0, 0],
                translate: [-this.controlWidth, 0, 20]
            });

            context.set('fullScreenOverlay', {
                size: [undefined, undefined],
                origin: [0, 0],
                align: [0, 0],
                translate: [0, 0, 5]
            });

            context.set('hiddenSurface', {
                size: [16, undefined],
                align: [0, 0],
                origin: [0, 0],
                translate: [0, 0, 50]
            });

        });

    }

    /**
     *
     * @param enabled
     */
    set enabled(enabled) {
        if (!this.draggable) {
            return;
        }
        enabled ? this.draggable.activate() : this.draggable.deactivate();
    }

    /**
     *
     * @param screenName
     */
    setScreenName(screenName) {
        this.sideMenuView.navigationItems.getItems().slice(-1)[0].renderables.textSurface.setContent(screenName);
    }

    /**
     *
     * @param info
     */
    setMenuInfo(info) {
        this.sideMenuView.setMenuInfo(info);
    }

    /**
     *
     * @returns {*}
     */
    getSelectedTabText() {
        let {navigationItems} = this.sideMenuView;
        return navigationItems.getItems()[navigationItems.getSelectedItemIndex()].data.text;
    }

    /**
     *
     * @param index
     */
    setTabIndexSelected(index) {
        let {navigationItems, options} = this.sideMenuView;

        if (!navigationItems || !(navigationItems instanceof TabBar) || (navigationItems instanceof  TabBar && !navigationItems.getItems().length)) {
            return;
        }

        this._explicitTabSelect = true;
        navigationItems.setSelectedItemIndex(index);
        navigationItems.getItems()[index].setSelected(true);

        /* Request that the menu changes title */
        this._eventOutput.emit('changeTitle', options.menuItems[index].text);
        this._explicitTabSelect = false;
    }

    /**
     *
     * @private
     */
    _createListeners() {
        this.fullScreenOverlay.on('click', ()=> {
            this.close();
        });

        let {navigationItems, options} = this.sideMenuView;
        /* The side menu has to close even if the resulting click did not change the selected tab,
         therefore we have to listen for click events and not only tabchange events
         */
        for (let item of navigationItems.getItems()) {
            item.on('click', () => {
                this.close();
            });
        }

        navigationItems.on('tabchange', (event) => {
            if (!this._explicitTabSelect) {
                let tabSpec = options.menuItems[event.index];
                /* Request that the menu changes title */
                this._eventOutput.emit('changeTitle', tabSpec.text);

                if (tabSpec.controller) this._eventOutput.emit('changeRouter', tabSpec);
            }
        });

    }

    /**
     *
     */
    resetState() {
        this.setTabIndexSelected(0);
    }

    /**
     *
     * @constructor
     */
    ShowSideBar() {
        this.renderables.fullScreenOverlay.show(this.fullScreenOverlayNode);
        this.renderables.sideMenuView.show(this.sideMenuScrollController);
        this.fullScreenOverlayModifier.setOpacity(1, DraggableSideMenu.transition);
    }

    /**
     *
     * @private
     */
    _hideSideBar() {
        this.renderables.fullScreenOverlay.hide();
        this.fullScreenOverlayModifier.setOpacity(0);
        this.renderables.sideMenuView.hide(this.sideMenuScrollController);
    }

    /**
     * Add a new item to the side menu
     * @param item
     */
    addItem(item) {
        this.renderables.sideMenuView.setItem(item);
    }
}
