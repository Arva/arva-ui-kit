/**
 * Created by Manuel on 05/06/16.
 */
import find                       from 'lodash/find.js'
import every                      from 'lodash/every.js'
import findIndex                  from 'lodash/findIndex.js'
import Surface                    from 'arva-js/famous/core/Surface.js'
import { Injection }              from 'arva-js/utils/Injection.js'
import { combineOptions }         from 'arva-js/utils/CombineOptions.js'
import FamousContext              from 'arva-js/famous/core/Context.js'
import { Router }                 from 'arva-js/core/Router.js'
import { View }                   from 'arva-js/core/View.js'
import AnimationController        from 'famous-flex/AnimationController.js'
import { DraggableSideMenu }      from './sideMenus/DraggableSideMenu.js'
import { TopMenu }                from './topMenus/TopMenu.js'
import { Dimensions }             from '../../defaults/DefaultDimensions.js'
import { StatusBarExtension }     from '../../utils/statusBar/StatusBarExtension.js'
import { layout, bindings, event, dynamic }             from 'arva-js/layout/Decorators.js'

@bindings.setup({
  sideMenu: {
    backgroundColor: 'white',
    menuItems: [],
    menuItem: {backgroundProperties: {backgroundColor: 'white'}}
  },
  closeOnRouteChange: true,
  displayTabOnController: true,
  topBarHeight: Dimensions.topBarHeight,
  showingTopBar: true,
  showSideMenu: true,
  showInitial: true,
  hideOnRoutes: [],
  enabled: true,
  topMenuClass: TopMenu,
  topMenuOptions: {backgroundProperties: {backgroundColor: 'white'}},
  sideMenuClass: DraggableSideMenu
})
export class NavigationDrawer extends View {


  @layout.dock.top(true)
  statusBarExtension = Injection.get(StatusBarExtension)

  /* Listen for sidemenu updates (drag events), so the Topbar can respond accordingly */
  @event.on('sideMenuUpdate', function () {
    this.topBar.sideMenuUpdate && this.topBar.sideMenuUpdate()
  })
  @layout.dock.fill()
  @layout.translate(0, 0, 1450)
  sideMenu = this.options.sideMenuClass.with()

  @dynamic(options =>
    layout.size(undefined, options.showingTopBar ? undefined : 0)
  )
  @layout
    .translate(0, 0, 1500)
    .animate({
      showInitially: true,
      show: {animation: AnimationController.Animation.Slide.Down},
      hide: {animation: AnimationController.Animation.Slide.Up}
    })
    .dock.top(function () {
      return this.options.topBarHeight
    })
  topBar = this.options.topMenuClass.with(this.options.topMenuOptions)

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
     *      showingTopBar: true,                       // if the top menu shows
     *      showInitial: true,                       // if the navigationDrawer shows on startup of the app
     *      enabled: true,                           // if the side menu draggable is enabled
     *      hideOnRoutes: [{                         // route's that will auto hide the top & side menu
     *          controller: 'Home',
     *          methods: ['Index','Register']
     *      }],
     *  });
   * @param {Object} [options] Options to pass in, see example.
   */
  constructor (options = {}) {
    super(options)
    console.log(this.options.backgroundColor)

    let famousContext = Injection.get(FamousContext)
    this.router = Injection.get(Router)

    /* Hijack Famous Context's add() method */
    famousContext.add(this)
    if (!famousContext.addToRoot) {
      famousContext.addToRoot = famousContext.add.bind(famousContext)
    }
    famousContext.add = this.addToContent
    this._initSideMenuTopBarConnection()

    /* Set the options */
    let initSideMenu = (options) => this.sideMenu.initWithOptions(options)
    let sideMenuOptions = this.options.sideMenu
    if (sideMenuOptions instanceof Promise) {
      sideMenuOptions.then(initSideMenu)
    } else {
      initSideMenu(sideMenuOptions)
    }

    if (options.showInitial != undefined && !options.showInitial) this.hideTopBar()
    this.router.on('routechange', this.onRouteChange)
  }

  /**
   * Hide the topbar for specific routechanges and change the title according the routechanges
   * @param route
   */
  onRouteChange (route) {
    /* Hide the menu on specific route changes */
    if (this.options.showingTopBar && this.options.hideOnRoutes) {
      if (find(this.options.hideOnRoutes, (hideRoute) => {
          return hideRoute.controller === route.controller && (!hideRoute.methods || hideRoute.methods.length === 0 || ~hideRoute.methods.indexOf(route.method) )
        }) !== undefined) {
        this.hideTopBar()
      } else {
        this.showTopBar()
      }
    }

    /* Change the menu on route changes */
    let currentMenuIndex = findIndex(this.options.sideMenu.menuItems, (menuItem) => {
      return menuItem.controller && menuItem.controller === route.controller && menuItem.method && menuItem.method === route.method &&
        ((menuItem.arguments && route.values.length) ? every(menuItem.arguments, (entry) => {
          return route.values.includes(entry)
        }) : true)
    })

    /* If no route is found, try to find a index for the controller only */
    if ((currentMenuIndex === undefined || currentMenuIndex === -1) && this.options.displayTabOnController) {
      currentMenuIndex = findIndex(this.options.sideMenu.menuItems, (menuItem) => {
        return menuItem.controller && menuItem.controller === route.controller
      })
    }

    if (currentMenuIndex !== undefined && ~currentMenuIndex) {
      this.topBar.titleText = this.options.sideMenu.menuItems[currentMenuIndex].text
      this.sideMenu.setTabIndexSelected(currentMenuIndex)
    }

    if (this.options.closeOnRouteChange) {
      this._closeMenu()
    }

  }

  /**
   *
   * @param renderable
   */
  addToContent (renderable) {
    //TODO replace with somehting better
    this.addRenderable(renderable, layout.dock.fill())
  }

  /**
   * Hide the top bar when it's currently being shown
   * @param animation
   */
  hideTopBar (animation = false) {
    this._hideTopBar(animation)
  }

  /**
   * Show the top bar when it's currently not being shown, and the navigationdrawer is _enabled
   */
  showTopBar () {
    if (this.options.enabled) {
      this.options.showingTopBar = true
    }
  }

  /**
   * Enable the Side Menu
   * @param enabled
   */
  setSideMenuEnabled (enabled) {
    this.sideMenu.enabled = enabled
    if (!enabled) {
      this.sideMenu.close()
    }
  }

  /**
   * Set the _enabled state of the NavigationDrawer
   * @param enabled
   */
  setNavigationDrawerEnabled (enabled) {
    this.options.enabled = enabled
    if (enabled) {
      this.showTopBar()
    } else {
      this.hideTopBar()
    }
    this.setSideMenuEnabled(enabled)
  }

  /**
   *
   * @param screenName
   */
  setScreenName (screenName) {
    this.sideMenu.setScreenName(screenName)
    if (this.topBar.setNewUser) this.topBar.setNewUser()
  }

  /**
   *
   */
  resetState () {
    this.sideMenu.resetState()
  }

  /**
   *
   * @param index
   */
  setTabIndexSelected (index) {
    this.sideMenu.setTabIndexSelected(index)
  }

  getSelectedTabOptions () {
    return this.sideMenu.getSelectedTabOptions()
  }

  /**
   * Open the top menu and side menu
   */
  openMenu () {
    if (this.options.showSideMenu) {
      this.sideMenu.open()
    }
  }

  setTitle (newTitle) {
    this.topBar.options.titleText = newTitle
  }

  setTopRightButton (button) {
    this.topBar.setRightButton(button)
  }

  /**
   * @deprecated
   * */
  setTopTemporaryLeftButton (button) {
    this.topBar.setTemporaryLeftButton(button)
  }

  /**
   * @deprecated
   * */
  removeTopTemporaryLeftButton (button) {
    this.topBar.removeTemporaryLeftButton(button)
  }

  _createTopBar (options) {
    let topBar

  }

  /**
   * Hide the top bar, canceling any animations that are in progress
   * @param animation
   * @private
   */
  async _hideTopBar (animation) {
    //todo clean up
    await this.hideRenderable(this.topBar, animation ? /*this.getActualRenderable(this.topBar).options.hide*/undefined : {transition: {duration: 0}});
    this.options.showTopBar = false
  }

  /**
   * Reveal the top bar with an animation
   * @param animation
   * @private
   */
  async _revealTopBar (animation = true) {
    await this.showRenderable(this.topBar, animation ? undefined : {transition: {duration: 0}})
    this.options.showTopBar = true
  }

  /**
   * Helper function to update the Top menu state depending on the state of the side menu
   * @private
   */
  _initSideMenuTopBarConnection () {

    this.topBar.on('requestMenuOpen', () => {
      this.openMenu()
    })

    this.topBar.on('requestMenuClose', () => {
      this._closeMenu()
    })

    this.topBar.on('titleClick', () => {
      this._handleOpenClose()
    })

    this._initSideMenuListeners()
  }

  /**
   *
   * @private
   */
  _initSideMenuListeners () {
    this.sideMenu.on('close', () => {
      this._eventOutput.emit('sideMenuClose')
      this.topBar.options.isOpen = false;
    })

    this.sideMenu.on('open', () => {
      this._eventOutput.emit('sideMenuOpen')
      this.showTopBar()
      this.topBar.options.isOpen = true;
    })

    this.sideMenu.on('update', (event) => {
      if (!this.options.showingTopBar) {
        let ratioDragged = Math.min((event.position[0] / this.sideMenu.draggable.options.xRange[1]) / 0.4, 1)
        if (!this.isRenderableShowing(this.topBar) || this.topBar.decorations.dock.size[1] === 0) {
          this._revealTopBar()
        }
        this.getActualRenderable(this.topBar).halt(true, ratioDragged)
      }
    })

    this.sideMenu.on('end', (event) => {
      /* Inconsistent state when sliding back the menu that requires an ugly fix:
       * The AnimationController doesn't want to abort the animation without first showing the
       * renderable, therefore we must hack the state a bit
       */
      if (this.isRenderableShowing(this.topBar) && !this.options.showingTopBar) {
        //TODO replace hack with arva code
        this.renderables.topBar._viewStack[0].state = 6
        this._hideTopBar(true)
      }
    })

    this.sideMenu.on('changeTitle', (newTitle) => {
      this.setTitle(newTitle)
    })

    this.sideMenu.on('changeRoute', (menuItem) => {
      this.router.go(menuItem.controller || 'Home', menuItem.method || 'Index', menuItem.arguments || {})
    })
  }

  /**
   * Hide the top and side menu if the users presses the backButton inside the top menu
   * @private
   */
  _onBackButton () {
    this._closeMenu()
  }

  /**
   * Close the top menu and side menu
   * @private
   */
  _closeMenu () {
    this.sideMenu.close()
  }

  /**
   * Handle open or closing the top menu upon clicking the title
   * @private
   */
  _handleOpenClose () {
    if (this.topBar.options.isOpen) {
      this._onBackButton()
    } else {
      this.openMenu()
    }
  }

}