/**
 * Created by Manuel on 05/06/16.
 */
import find                     from 'lodash/find.js';
import every                    from 'lodash/every.js';
import findIndex                from 'lodash/findIndex.js';
import Surface                  from 'famous/core/Surface.js';
import {Injection}              from 'arva-js/utils/Injection.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import FamousContext            from 'famous/core/Context.js';
import {Router}                 from 'arva-js/core/Router.js';
import {View}                   from 'arva-js/core/View.js';
import {layout, options}        from 'arva-js/layout/Decorators.js';
import AnimationController      from 'famous-flex/AnimationController.js';
import {DraggableSideMenu}      from './sideMenus/DraggableSideMenu.js';
import {TopMenu}                from './topMenus/TopMenu.js';
import {Dimensions}             from '../../defaults/DefaultDimensions.js';
import {StatusBarExtension}     from '../../utils/statusBar/StatusBarExtension.js';

export class NavigationDrawer extends View {

    @layout.dock.top(true)
    statusBarExtension = Injection.get(StatusBarExtension);

    @layout.dock.fill()
    @layout.translate(0, 0, 1450)
    sideMenu = new this.options.sideMenuClass();

    @layout.translate(0, 0, 1500)
    @layout.animate({
        showInitially: true,
        show: { animation: AnimationController.Animation.Slide.Down },
        hide: { animation: AnimationController.Animation.Slide.Up }
    })
    @layout.dock.top(function () {
        return this.options.topBarHeight
    })
    topBar = this._createTopBar();


    /**
     *  @example
     *  Injector.get(NavigationDrawer, {
     *      backgroundColor: 'rgb(231, 254, 255)',   // Sets the background color for all elements in the NavigationDrawer
     *      topMenuOptions: {
     *          defaultTitle: 'Title'                // default top menu title
     *      },
     *      sideMenu: {                              // Options for the side menu. Return promise to delay creation
     *          itemMargin: 10,                      // The margins between the items. Defaults to 10
     *          itemHeight: 44,                      // The height of each item. Defaults to 44
     *          direction: 1,
     *          viewClass: DraggableSideMenu         // draggable side menu renderable, defaults to DraggableSideMenu
     *          itemClass: : MenuItem,               // side menu item's renderable, defaults to MenuItem
     *          menuItems: [{                        // Options for the menu items
     *              text: 'Index',                   // The text of the menu item
     *              controller: 'Home',              // The associated controller of the menu item, defaults to 'Home'
     *              method: 'Index',                 // The associated method of the menu item, defaults to 'Index'
     *              arguments: {banana: true}        // The arguments passed to the controller, defaults to {}
     *          }],
     *          menuItem: {}                         // Options for every menu item (textColor, highlightedTextColor, etc)
     *      },
     *      sideMenuClass: DraggableSideMenu         // The class used for the side menu, defaults to DraggableSideMenu
     *      topMenuClass: TopMenu,                   // top menu renderable, defaults to TopMenu
     *      showTopMenu: true,                       // if the top menu shows
     *      showInitial: true,                       // if the navigationDrawer shows on startup of the app
     *      enabled: true,                           // if the side menu draggable is enabled
     *      hideOnRoutes: [{                         // route's that will auto hide the top & side menu
     *          controller: 'Home',
     *          methods: ['Index','Register']
     *      }],
     *  });
     * @param {Object} [options] Options to pass in, see example.
     */
    constructor(options = {}) {
        /* Store background color for all NavigationDrawer elements. */
        let globalBackgroundColor = options.backgroundColor;

        super(combineOptions({
            sideMenu: {
                backgroundColor: globalBackgroundColor || undefined,
                menuItems: [],
                menuItem: globalBackgroundColor
                    ? { backgroundProperties: { backgroundColor: globalBackgroundColor } }
                    : {}
            },
            closeOnRouteChange: true,
            displayTabOnController: true,
            topBarHeight: Dimensions.topBarHeight,
            showTopMenu: true,
            showSideMenu: true,
            showInitial: true,
            hideOnRoutes: [],
            enabled: true,
            topMenuClass: TopMenu,
            topMenuOptions: globalBackgroundColor
                ? { backgroundProperties: { backgroundColor: globalBackgroundColor } }
                : {},
            sideMenuClass: DraggableSideMenu
        }, options));

        let famousContext = Injection.get(FamousContext);
        this.router = Injection.get(Router);

        /* Hijack Famous Context's add() method */
        famousContext.add(this);
        if (!famousContext.addToRoot) {
            famousContext.addToRoot = famousContext.add.bind(famousContext);
        }
        famousContext.add = this.addToContent.bind(this);
        this._initSideMenuTopBarConnection();
        this.idCounter = 0;
        this.showingTopBar = true;

        /* Set the options */
        let initSideMenu = (options) => this.sideMenu.initWithOptions(options);
        let sideMenuOptions = this.options.sideMenu;
        if (sideMenuOptions instanceof Promise) {
            sideMenuOptions.then(initSideMenu);
        } else {
            initSideMenu(sideMenuOptions);
        }

        this._enabled = this.options.enabled;
        if (options.showInitial != undefined && !options.showInitial) this.hideTopBar();
        this.router.on('routechange', this.onRouteChange.bind(this));
    }

    /**
     * Hide the topbar for specific routechanges and change the title according the routechanges
     * @param route
     */
    onRouteChange(route) {
        /* Hide the menu on specific route changes */
        if (this.options.showTopMenu && this.options.hideOnRoutes) {
            if (find(this.options.hideOnRoutes, (hideRoute) => {
                    return hideRoute.controller === route.controller && (!hideRoute.methods || hideRoute.methods.length === 0 || ~hideRoute.methods.indexOf(route.method) );
                }) !== undefined) {
                this.hideTopBar();
            } else {
                this.showTopBar();
            }
        }

        /* Change the menu on route changes */
        let currentMenuIndex = findIndex(this.options.sideMenu.menuItems, (menuItem) => {
            return menuItem.controller && menuItem.controller === route.controller && menuItem.method && menuItem.method === route.method &&
                ((menuItem.arguments && route.values.length) ? every(menuItem.arguments, (entry) => {
                        return ~route.values.indexOf(entry)
                    }) : true)
        });

        /* If no route is found, try to find a index for the controller only */
        if ((currentMenuIndex === undefined || currentMenuIndex === -1) && this.options.displayTabOnController) {
            currentMenuIndex = findIndex(this.options.sideMenu.menuItems, (menuItem) => {
                return menuItem.controller && menuItem.controller === route.controller;
            });
        }

        if (currentMenuIndex !== undefined && ~currentMenuIndex) {
            if (this.topBar.setTitle) this.topBar.setTitle(this.options.sideMenu.menuItems[currentMenuIndex].text);
            this.sideMenu.setTabIndexSelected(currentMenuIndex);
        }

        if (this.options.closeOnRouteChange) {
            this._closeMenu();
        }

    }

    /**
     *
     * @param renderable
     */
    addToContent(renderable) {
        this.addRenderable(renderable, `renderable${this.idCounter++}`, layout.dock.fill());
    }

    /**
     * Hide the top bar when it's currently being shown
     * @param animation
     */
    hideTopBar(animation = false) {
        if (this.options.showTopMenu && this.showingTopBar) {
            this.showingTopBar = false;
            this._hideTopBar(animation);
        }
    }

    /**
     * Show the top bar when it's currently not being shown, and the navigationdrawer is _enabled
     */
    showTopBar() {
        if (this.options.showTopMenu && !this.showingTopBar && this._enabled) {
            this.showingTopBar = true;
            this._revealTopBar();
        }
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
     * Set the _enabled state of the NavigationDrawer
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
     *
     * @param screenName
     */
    setScreenName(screenName) {
        this.sideMenu.setScreenName(screenName);
        if (this.topBar.setNewUser) this.topBar.setNewUser();
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


    getSelectedTabOptions() {
        return this.sideMenu.getSelectedTabOptions();
    }

    /**
     * Open the top menu and side menu
     */
    openMenu() {
        if (this.options.showSideMenu) {
            this.sideMenu.open();
        }
    }


    setTitle(newTitle) {
        this.topBar.setTitle(newTitle);
    }

    setTopRightButton(button) {
        this.topBar.setRightButton(button);
    }

    /**
     * @deprecated
     * */
    setTopTemporaryLeftButton(button) {
        this.topBar.setTemporaryLeftButton(button);
    }

    /**
     * @deprecated
     * */
    removeTopTemporaryLeftButton(button) {
        this.topBar.removeTemporaryLeftButton(button);
    }

    _createTopBar() {
        let topBar;
        if (!this.options.showTopMenu) {
            return new Surface({ properties: { backgroundColor: 'transparent' } });
        }
        topBar = new this.options.topMenuClass(this.options.topMenuOptions, this.options.topBarHeight);

        /* Listen for sidemenu updates (drag events), so the Topbar can respond accordingly */
        this.sideMenu.on('sideMenuUpdate', () => {
            topBar.sideMenuUpdate && topBar.sideMenuUpdate();
        });

        return topBar;
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
        this.renderables.topBar.hide(animation ? this.renderables.topBar.options.hide : { transition: { duration: 0 } }, callback);
    }

    /**
     * Reveal the top bar with an animation
     * @param animation
     * @private
     */
    _revealTopBar(animation = true) {
        this.immediateAnimations = [];
        this.topBar.decorations.dock.size[1] = this.options.topBarHeight;
        this.renderables.topBar.show(this.topBar, animation ? undefined : { transition: { duration: 0 } });
        this.layout.reflowLayout();
    }

    /**
     * Helper function to update the Top menu state depending on the state of the side menu
     * @private
     */
    _initSideMenuTopBarConnection() {
        this.infoState = false;

        this.topBar.on('requestMenuOpen', () => {
            this._handleOpenClose();
        });

        this.topBar.on('titleClick', () => {
            this._handleOpenClose();
        });

        this._initSideMenuListeners();
    }

    /**
     *
     * @private
     */
    _initSideMenuListeners() {
        this.sideMenu.on('close', () => {
            this._eventOutput.emit('sideMenuClose');
            if (this.topBar.close) this.topBar.close();
        });

        this.sideMenu.on('open', () => {
            this._eventOutput.emit('sideMenuOpen');
            this.showTopBar();
            if (this.topBar.open) this.topBar.open();
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
            if (this.topBar.setTitle) this.topBar.setTitle(newTitle);
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
     * Close the top menu and side menu
     * @private
     */
    _closeMenu() {
        // todo refactor old code
        if (this.topBar.topMenuView) this.topBar.topMenuView.close();
        this.sideMenu.close()
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

}