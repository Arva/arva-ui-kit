/**
 * Created by manuel on 09-09-15.
 */
import Surface                  from 'famous/core/Surface.js';
import TabBar                   from 'famous-flex/widgets/TabBar.js';

import {View}                   from 'arva-js/core/View.js';
import {layout}                 from 'arva-js/layout/Decorators.js';
import {Router}                 from 'arva-js/core/Router.js';
import {Injection}              from 'arva-js/utils/Injection.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';

import AnimationController      from 'famous-flex/AnimationController';
import RenderNode               from 'famous/core/RenderNode';
import Easing                   from 'famous/transitions/Easing';
import Draggable                from 'famous/modifiers/Draggable';
import StateModifier            from 'famous/modifiers/StateModifier';

import {DraggableSideMenuView}  from './DraggableSideMenuView.js';
import {Dimensions}             from '../../../defaults/DefaultDimensions.js';

export class DraggableSideMenu extends View {

    static get transition() {
        return {duration: 200, curve: Easing.inOutQuad}
    }

    @layout.fullSize()
    @layout.animate({
        showInitially: false,
        transition: {duration: 200, curve: Easing.inOutQuad},
        animation: AnimationController.Animation.Fade
    })
    fullScreenOverlay = new Surface({
        properties: {
            background: 'radial-gradient(ellipse at left, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)'
        }
    });

    /** The renderables of the draggableSideMenu is only initialised on initWithOptions()
     *
     * @param options
     */
    constructor() {
        super();
        this.toggle = false;
        this.direction = true;
        this.router = Injection.get(Router);
    }

    /**
     *
     * @param options
     */
    initWithOptions(options) {
        this.initialised = true;
        options = combineOptions({
                ...Dimensions.sideMenu,
                viewClass: DraggableSideMenuView
            },
            options);
        this._createRenderables(options);
        this._createListeners();
        this.options = options;
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
        this._isOpen = true;

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
        this._isOpen = false;

        if (this.draggable) {
            this.draggable.setPosition([0, 0, 0], {duration: 250, curve: Easing.outQuint});
            this._hideSideBar();
        }
        this.hideRenderable(this.fullScreenOverlay);

        this._eventOutput.emit('close');
    }

    /**
     *
     * @param options
     * @private
     */
    _createRenderables(options) {

        /* Due to complex interaction between components, the legacy way of defining layout is used */
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

        this.sideMenuView = new options.viewClass(options);
        this.maxRange = 200;
        /* Gets set properly after 1 render tick, by layout function below. */

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

        this._realRenderables.hiddenSurface = hiddenSurfaceNode;
        this.hiddenSurface.pipe(this.draggable);

        let mod = new StateModifier();
        let dragNode = new RenderNode();
        dragNode.add(mod).add(this.draggable).add(this.sideMenuView);
        this._realRenderables.control = dragNode;

        this.sideMenuView.pipe(this.draggable);
        this.fullScreenOverlay.pipe(this.draggable);

        this.draggable.on('end', (dragEvent) => {
            if (this.direction) {
                (dragEvent.position[0] < this.controlWidth / 3) ? this.close() : this.open();
            } else {
                (dragEvent.position[0] > this.controlWidth * (2 / 3)) ? this.open() : this.close();
            }

        });

        this.draggable.on('update', (dragEvent)=> {
            let ratio = 1 - dragEvent.position[0] / this.controlWidth;
            /* Because AnimationController....... */
            if (this.isRenderableShowing(this.fullScreenOverlay)) {
                this.hideRenderable(this.fullScreenOverlay);
            } else if (!this._isOpen) {
                this.showRenderable(this.fullScreenOverlay);
            }
            if (!this._isOpen) {
                ratio = 1 - ratio;
            }
            this.getActualRenderable(this.fullScreenOverlay).halt(true, ratio);
            this.direction = (dragEvent.position[0] > this.lastPosition);
            this.lastPosition = dragEvent.position[0];
        });

        this.setTabIndexSelected(0);
        this.layout.reflowLayout();

        this.layout.on('layoutstart', ({size: [width]}) => {
            this.controlWidth = Math.min(320, width * ( options.width || 0.75 )) | 0;
            /* Update xRange of draggable, as size is now defined */
            this.draggable.setOptions({
                xRange: [0, this.controlWidth]
            });
        });

        this.layouts.push((context) => {

            context.set('control', {
                size: [this.controlWidth, undefined],
                origin: [0, 0],
                align: [0, 0],
                translate: [-this.controlWidth, 0, 20]
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
    getSelectedTabOptions() {
        let {navigationItems} = this.sideMenuView;
        return navigationItems.getItems()[navigationItems.getSelectedItemIndex()].options;
    }

    /**
     *
     * @param index
     */
    setTabIndexSelected(index) {
        let {navigationItems, options} = this.sideMenuView;

        if (!navigationItems || !(navigationItems instanceof TabBar) || (navigationItems instanceof TabBar && !navigationItems.getItems().length)) {
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
                if (tabSpec.controller || tabSpec.method || tabSpec.arguments) this._eventOutput.emit('changeRoute', tabSpec);
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
        this.showRenderable(this.fullScreenOverlay);
        // this.renderables.sideMenuView.show(this.sideMenuScrollController);
    }

    /**
     *
     * @private
     */
    _hideSideBar() {
        if (this.isRenderableShowing(this.fullScreenOverlay)) {
            /* Hack to interrupt hiding of sideBar */
            this.getActualRenderable(this.fullScreenOverlay)._viewStack[0].state = 6;
            this.hideRenderable(this.fullScreenOverlay);
        }
        // this.renderables.sideMenuView.hide(this.sideMenuScrollController);
    }

    /**
     * Add a new item to the side menu
     * @param item
     */
    addItem(item) {
        this.renderables.sideMenuView.setItem(item);
    }
}
