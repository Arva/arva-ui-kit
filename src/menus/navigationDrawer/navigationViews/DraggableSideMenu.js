/**
 * Created by manuel on 09-09-15.
 */
import Surface                  from 'famous/core/Surface.js';
import ScrollController         from 'famous-flex/ScrollController.js';
import ListLayout               from 'famous-flex/layouts/ListLayout.js';

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
            this.draggable.setPosition([this.controlHeight, 0, 0], {duration: 250, curve: Easing.outQuint});
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
            animation: AnimationController.Animation.Fade,
            transition: {duration: 250, curve: Easing.outQuint}
        });

        this.sideMenuView = this.options.draggableSideMenuViewRenderable ? new this.options.draggableSideMenuViewRenderable(options) : new DraggableSideMenuView(options);
        this.sideMenuScrollController = new ScrollController({
            layout: ListLayout,
            dataSource: [this.sideMenuView],
            autoPipeEvents: true,
            overscroll: false,
            scrollSync: {
                rails: true
            },
            touchMoveDirectionThreshold: 0.2
        });
        this.fullScreenOverlay = new FullScreenBackground({color: 'rgba(0, 0, 0, 0.25)'});
        this.maxRange = 200;

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
        dragNode.add(mod).add(this.draggable).add(this.sideMenuScrollController);
        this.renderables.control = dragNode;

        this.sideMenuScrollController.pipe(this.draggable);
        this.fullScreenOverlay.pipe(this.draggable);

        this.draggable.on('end', (dragEvent) => {
            if (this.direction) {
                (dragEvent.position[0] < this.controlHeight / 3) ? this.close() : this.open();
            } else {
                (dragEvent.position[0] > this.controlHeight * (2 / 3)) ? this.open() : this.close();
            }

        });

        this.draggable.on('update', (dragEvent)=> {
            this.direction = (dragEvent.position[0] > this.lastPosition);
            this.lastPosition = dragEvent.position[0];
        });

        this.setTabIndexSelected(0);
        this.layout.reflowLayout();

        this.layouts.push((context) => {

            this.controlHeight = Math.min(320, context.size[0] * ( options.width || 0.75 ));

            // update xRange of draggable, as context is now definedcor
            this.draggable.setOptions({
                xRange: [0, this.controlHeight]
            });


            //TODO: replace window.size things with proper definitions
            context.set('control', {
                size: [this.controlHeight, window.innerHeight],
                origin: [0, 0],
                align: [0, 0],
                translate: [-this.controlHeight, 0, 20]
            });

            context.set('fullScreenOverlay', {
                size: [window.innerWidth, window.innerHeight],
                origin: [0, 0],
                align: [0, 0],
                translate: [0, 0, 5]
            });

            context.set('hiddenSurface', {
                size: [20, window.innerHeight],
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
        this.sideMenuView.renderables.navigationItems.getItems().slice(-1)[0].renderables.textSurface.setContent(screenName);
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
        let {navigationItems} = this.sideMenuView.renderables;
        return navigationItems.getItems()[navigationItems.getSelectedItemIndex()].data.text;
    }

    /**
     *
     * @param index
     */
    setTabIndexSelected(index) {
        let {navigationItems} = this.sideMenuView.renderables;

        if (!navigationItems || !(navigationItems instanceof Array)) {
            return;
        }

        this._explicitTabSelect = true;
        navigationItems.setSelectedItemIndex(index);
        navigationItems.getItems()[index].setSelected(true);

        /* Request that the menu changes title */
        this._eventOutput.emit('changeTitle', this.options.menuItems[index].text);
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

        /* The side menu has to close even if the resulting click did not change the selected tab,
         therefore we have to listen for click events and not only tabchange events
         */
        for (let item of this.sideMenuView.renderables.navigationItems.getItems()) {
            item.on('click', () => {
                this.close();
            });
        }
        this.sideMenuView.renderables.navigationItems.on('tabchange', (event) => {
            if (!this._explicitTabSelect) {
                let tabSpec = this.options.menuItems[event.index];
                /* Request that the menu changes title */
                this._eventOutput.emit('changeTitle', tabSpec.text);

                if (tabSpec.controller) this._eventOutput.emit('changeRouter', tabSpec);
            }
        })
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
        this.renderables.sideMenuView.show(this.sideMenuScrollController);
        this.renderables.fullScreenOverlay.show(this.fullScreenOverlay);
    }

    /**
     *
     * @private
     */
    _hideSideBar() {
        this.renderables.sideMenuView.hide(this.sideMenuScrollController);
        this.renderables.fullScreenOverlay.hide(this.fullScreenOverlay);
    }

    /**
     * Add a new item to the side menu
     * @param item
     */
    addItem(item) {
        this.renderables.sideMenuView.setItem(item);
    }
}
