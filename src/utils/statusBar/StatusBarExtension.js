/**
 * Created by tom on 24/08/16.
 */

import Color                from 'color'
import Surface              from 'famous/core/Surface.js'
import Context              from 'famous/core/Context.js'
import { View }               from 'arva-js/core/View.js'
import { Injection }          from 'arva-js/utils/Injection.js'
import { layout, bindings, dynamic }             from 'arva-js/layout/Decorators.js'
import { Colors }             from '../../defaults/DefaultColors.js'

@bindings.setup({
  color: Colors.PrimaryUIColor,
  isShowing: false
})
export class StatusBarExtension extends View {

  isiOS = window && window.device && window.device.platform === 'iOS'

  @dynamic(({isShowing}) =>
    layout.size(isShowing ? undefined : 0, isShowing ? 20 : 0)
  )
  @layout
    .translate(0, 0, 500)
  background = Surface.with({
    properties: {
      display: this.options.isShowing ? 'block' : 'hidden',
      backgroundColor: this.options.color
    }
  })

  /**
   * A single background surface, 20 pixels tall, that is only shown on iOS if a status bar is enabled. Used from within e.g. top menus.
   * Uses either DefaultColors' PrimaryUIColor, or a supplied color.
   *
   * @param {Object} [options] Options passed onto base View class
   * @param {String} [options.color] Color to use instead of PrimaryUIColor
   */
  constructor (options) {
    super(options)

    if (this.isiOS && window.StatusBar) {
      window.StatusBar.show()
    }

    Injection.get(Context).on('resize', this._onResize)
    this._onResize()
  }

  setColor (color) {
    if (!this.isiOS) { return }

    let colorDefinition = Color(color)
    this.background.setProperties({backgroundColor: color})

    /* Set the color of the items on the status bar */
    let method = colorDefinition.light() ? 'styleDefault' : 'styleLightContent'
    if (window.StatusBar && window.StatusBar[method]) { window.StatusBar[method]() }
  }

  getSize () {
    return this.background.decorations.size
  }

  _onResize () {
    /* In landscape mode on iPad, the status bar is hidden. Hence, we need to subscribe to changes in portrait/landscape modes. */
    this.options.isShowing = this.isiOS && window.StatusBar && window.StatusBar.isVisible
  }

}