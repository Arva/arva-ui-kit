/**
 * Created by tom on 12/10/15.
 */
import _                        from 'lodash';
import Surface                  from 'famous/core/Surface.js';
import {Injection}              from 'arva-js/utils/Injection.js';
import FamousContext            from 'famous/core/Context.js';
import {Router}                 from 'arva-js/core/Router.js';
import {View}                   from 'arva-js/core/View.js';
import {layout, options}        from 'arva-js/layout/decorators.js';
import AnimationController      from 'famous-flex/AnimationController.js';
import {DraggableSideMenu}      from './DraggableSideMenu.js';
import {TopMenu}                from './TopMenu.js';
import {MenuItem}               from './MenuItem.js';
import {Dimensions}             from '../../defaults/DefaultDimensions.js';

export class NavigationDrawer extends View {

    constructor(options = {}) {
        options = {
            topMenuOptions: {
                defaultTitle: 'Title'
            },
            sideMenuOptions: {
                itemMargin: 10,
                itemHeight: 44,
                direction: 1
            },
            draggableSideMenuRenderable: DraggableSideMenu,
            topMenuRenderable: TopMenu,
            sideMenuRenderable: MenuItem,
            showInitial: true,
            enabled: true,
            hideOnRoutes: [],
            menuItems: [{
                text: 'Title 1',
                controller: 'Home',
                method: 'Boo',
                arguments: {}
            }, {text: 'Title 2', controller: 'Home', method: 'Baa'}]
        };

        super(options);

        let famousContext = Injection.get(FamousContext);
        this.router = Injection.get(Router);

        /* Hijack Famous Context's add() method */
        famousContext.add(this);
        famousContext.add = this.addToContent;
        this._initSideMenuTopBarConnection();
        this.idCounter = 0;
        this.showingTopBar = true;

        /* Set the options */
        if (options.menuItems) this.sideMenu.setData(options);
        if (options.enabled != undefined) this.setNavigationDrawerEnabled(options.enabled);
        if (options.showInitial != undefined && !options.showInitial) this.hideTopBar();
        this.router.on('routechange', this.onRouteChange);

    }

    @layout.dock('top', function () {
        return this.options.topBarHeight ? this.options.topBarHeight : Dimensions.topBarHeight
    })
    @layout.translate(0, 0, 30)
    @layout.animate({
        showInitially: true,
        show: {animation: AnimationController.Animation.Slide.Down},
        hide: {animation: AnimationController.Animation.Slide.Up}
    })
    topBar = this.options.topMenuRenderable ? new this.options.topMenuRenderable(this.options.topMenuOptions || {}) : new TopMenu(this.options.topMenuOptions)

    @layout.fullscreen
    sideMenu = this.options.draggableSideMenuRenderable ? new this.options.draggableSideMenuRenderable(this.options.sideMenuOptions) : new DraggableSideMenu(this.options.sideMenuOptions)

    /**
     * Hide the topbar for specific routechanges and change the title according the routechanges
     * @param route
     */
    onRouteChange(route) {

        /* Hide the menu on specific route changes */
        if (this.options.hideOnRoutes) {
            if (_.find(this.options.hideOnRoutes, (hideRoute)=> {
                    return hideRoute.controller === route.controller && (~hideRoute.methods.indexOf(route.method) || hideRoute.methods.length === 0);
                }) !== undefined) {
                this.hideTopBar();
            } else {
                this.showTopBar();
            }
        }

        /* Change the menu on route changes */
        let currentMenuIndex = _.findIndex(this.options.menuItems, (menuItem)=> {
            return menuItem.controller && menuItem.controller === route.controller && menuItem.method && menuItem.method === route.method;
        });
        if (currentMenuIndex !== undefined) {
            this.topBar.setTitle(this.options.menuItems[currentMenuIndex].text);
            this.sideMenu.setTabIndexSelected(currentMenuIndex);
        }

    }

    /**
     *
     * @param renderable
     */
    addToContent(renderable) {
        this.addRenderable(renderable, `renderable${this.idCounter++}`, layout.dock('fill'));
    }

    /**
     * Hide the top bar when it's currently being shown
     * @param animation
     */
    hideTopBar(animation = false) {
        if (this.showingTopBar) {
            this.showingTopBar = false;
            this._hideTopBar(animation);
        }
    }

    /**
     * Show the top bar when it's currently not being shown, and the navigationdrawer is enabled
     */
    showTopBar() {
        if (!this.showingTopBar && this._enabled) {
            this.showingTopBar = true;
            this._revealTopBar();
        }
    }

    /**
     * Hide the top bar, canceling any animations that are in progress
     * @param animation
     * @private
     */
    _hideTopBar(animation) {
        this.immediateAnimations = [];
        let callback;
        let removeTopBarFromFlow = () => {
            this.topBar.decorations.dock.size[1] = 0;
            this.layout.reflowLayout();
        };
        if (animation) {
            callback = removeTopBarFromFlow;
        } else {
            removeTopBarFromFlow();
        }
        this.renderables.topBar.hide(animation ? this.renderables.topBar.options.hide : {transition: {duration: 0}}, callback);
    }

    /**
     * Reveal the top bar with an animation
     * @param animation
     * @private
     */
    _revealTopBar(animation = true) {
        this.immediateAnimations = [];
        this.topBar.decorations.dock.size[1] = Dimensions.topBarHeight;
        this.renderables.topBar.show(this.topBar, animation ? undefined : {transition: {duration: 0}});
        this.layout.reflowLayout();
    }

    /**
     * Enable the Side Menu
     * @param enabled
     */
    setSideMenuEnabled(enabled) {
        this.sideMenu.enabled = enabled;
        if (!enabled) {
            this.sideMenu.close();
        }
    }

    /**
     * Set the enabled state of the NavigationDrawer
     * @param enabled
     */
    setNavigationDrawerEnabled(enabled) {
        this._enabled = enabled;
        if (enabled) {
            this.showTopBar();
        } else {
            this.hideTopBar();
        }
        this.setSideMenuEnabled(enabled);
    }

    /**
     * Helper function to update the Top menu state depending on the state of the side menu
     * @private
     */
    _initSideMenuTopBarConnection() {
        this.infoState = false;

        this.topBar.on('requestMenuOpen', ()=> {
            this.openMenu();
        });
        this.topBar.on('requestMenuClose', ()=> {
            this._onBackButton();
        });

        this.topBar.on('rightButtonClick', ()=> {
            this._eventOutput.emit('rightButtonClick');
        });
        this.topBar.on('titleClick', ()=> {
            this._handleOpenClose();
        });

        this._initSideMenuListeners();
    }

    /**
     *
     * @private
     */
    _initSideMenuListeners() {
        this.sideMenu.on('close', ()=> {
            this._eventOutput.emit('sideMenuClose');
            this.topBar.close();
        });

        this.sideMenu.on('open', ()=> {
            this._eventOutput.emit('sideMenuOpen');
            this.showTopBar();
            this.topBar.open();
        });

        this.sideMenu.on('update', (event) => {
            if (!this.showingTopBar) {
                let ratioDragged = Math.min((event.position[0] / this.sideMenu.draggable.options.xRange[1]) / 0.4, 1);
                if (!this.renderables.topBar.get() || this.topBar.decorations.dock.size[1] === 0) {
                    this._revealTopBar();
                }
                this.renderables.topBar.halt(true, ratioDragged);
            }
        });

        this.sideMenu.on('end', (event) => {
            /* Inconsistent state when sliding back the menu that requires an ugly fix:
             * The AnimationController doesn't want to abort the animation without first showing the
             * renderable, therefore we must hack the state a bit
             */
            if (this.renderables.topBar.get() && !this.showingTopBar) {
                this.renderables.topBar._viewStack[0].state = 6;
                this._hideTopBar(true);
            }
        });

        this.sideMenu.on('changeTitle', (newTitle) => {
            this.topBar.setTitle(newTitle);
        });

        this.sideMenu.on('changeRouter', (menuItem) => {
            this.router.go(menuItem.controller || 'Home', menuItem.method || 'Index', menuItem.arguments || {});
        });
    }

    /**
     * Hide the top and side menu if the users presses the backButton inside the top menu
     * @private
     */
    _onBackButton() {
        this._closeMenu();
    }

    /**
     * Update the TopTitle to the current active Tab within the side menu
     */
    setCorrectTopTitle() {
        this.topBar.setTitle(this.sideMenu.getSelectedTabText());
    }

    /**
     * Close the top menu and side menu
     * @private
     */
    _closeMenu() {
        this.topBar.topMenuView.close();
        this.sideMenu.close()
    }

    /**
     * Open the top menu and side menu
     */
    openMenu() {
        this.topBar.topMenuView.open();
        this.sideMenu.open();
    }

    /**
     * Handle open or closing the top menu upon clicking the title
     * @private
     */
    _handleOpenClose() {
        if (this.topBar.isOpen) {
            this._onBackButton();
        } else {
            this.openMenu();
        }
    }

    /**
     *
     * @param screenName
     */
    setScreenName(screenName) {
        this.sideMenu.setScreenName(screenName);
        this.topBar.setNewUser();
    }

    /**
     *
     */
    resetState() {
        this.sideMenu.resetState();
    }

    /**
     *
     * @param index
     */
    setTabIndexSelected(index) {
        this.sideMenu.setTabIndexSelected(index);
    }

}