/**
 * Created by manuel on 09-09-15.
 */
import isEqual                                          from 'lodash/isEqual.js';

import {Injection}                                      from 'arva-js/utils/Injection.js';
import {combineOptions}                                 from 'arva-js/utils/CombineOptions.js';
import {Router}                                         from 'arva-js/core/Router.js';

import {UIBar}                                          from '../../../uibars/UIBar.js';
import {InfoIcon}                                       from '../../../icons/InfoIcon.js';
import {UIBarTitle}                                     from '../../../text/UIBarTitle.js';
import {HamburgerIcon}                                  from '../../../icons/HamburgerIcon.js';
import {ArrowleftIcon}                                  from '../../../icons/ArrowleftIcon.js';
import {Clickable}                                      from '../../../components/Clickable.js';
import {UIBarIconButton}                                from '../../../buttons/UIBarIconButton.js';
import {StatusBarExtension}                             from '../../../utils/statusBar/StatusBarExtension.js';
import { layout, bindings, event, dynamic }             from 'arva-js/layout/Decorators.js'

@bindings.setup({
  bottomLine: true,
  titleText: '',
  isOpen: false
})
export class TopMenu extends UIBar {

    /**
     * Top menu containing buttons with custom functionality
     *
     * @param {Object} options Construction options
     * @param {String} [options.defaultTitle] The default title to be displayed in the center of the TopMenu
     * @param {Boolean} [options.persistentButtons] Whether the topMenu buttons should persist on route change. E.g: if a certain Controller/Method has
     * specific buttons, change the buttons back to the previous buttons on route change.
     * @param {Object.Object.Object.Array} [options.dynamicButton] An option through which buttons can be customized per controller method.
     *                                     If clickEventName is not provided, will emit 'left', 'left2', 'left3' etc automatically.
     *          dynamicButtons: {
     *               'Home': {
     *                   'Index': {
     *                       left: [
     *                           new UIBarIconButton({clickEventName: 'left0', icon: AccountIcon})
     *                       ],
     *                       right: [
     *                           new UIBarIconButton({clickEventName: 'right0', icon: LeftIcon}),
     *                           new UIBarIconButton({clickEventName: 'right1', icon: LeftIcon})
     *                       ],
     *                       title: 'First Page',
     *                       persistentButtons: false,
     *                   },
     *                   'Edit': {
     *                       left: [
     *                           new UIBarIconButton({clickEventName: 'left0', icon: HamburgerIcon})
     *                       ],
     *                       right: [
     *                           new UIBarIconButton({clickEventName: 'right0', icon: LeftIcon}),
     *                           new UIBarIconButton({clickEventName: 'right1', icon: LeftIcon})
     *                       ],
     *                       title: 'First Page',
     *                       persistentButtons: false,
     *                   }
     *               }
     *           }
     */

    buttonsCache = {};
    persistentButtons = true;

    @event.on('click', function () {
      this._eventOutput.emit('titleClick');
    })
    @layout.stick.center().size(true, true)
    title = UIBarTitle.with({
      content: this.options.titleText
    })

    @layout.animate()
    @layout.dock.left(true)
    menuButton = this.options.isOpen ? UIBarIconButton.with({
      clickEventName: 'requestMenuClose',
      icon: ArrowleftIcon,
    }) : UIBarIconButton.with({
      clickEventName: 'requestMenuOpen',
      icon: HamburgerIcon,
    }) ;

    @layout.dock.right(true)
    rightButton = UIBarIconButton.with({
      clickEventName: 'rightButtonClick',
      icon: InfoIcon
    });

    constructor(options = {}) {

        super(options);

        this.router = Injection.get(Router);

        if (window.StatusBar) {
            let color = this.options.colored ? this.options.backgroundProperties.backgroundColor : 'rgb(255, 255, 255)';
            Injection.get(StatusBarExtension).setColor(color);
        }


        this.router.on('routechange', this.onRouteChange.bind(this));
    }

    onRouteChange(route) {
        let { controller, method } = route;
        //todo fill with code
    }
}