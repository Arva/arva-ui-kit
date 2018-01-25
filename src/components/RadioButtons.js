/**
 * Created by vlad on 19/09/16.
 */

import {Surface}                            from 'arva-js/surfaces/Surface.js';
import {Clickable}                          from './Clickable.js';
import {RadioButton}                        from './radioButtons/RadioButton.js';
import {Colors}                             from '../defaults/DefaultColors.js';
import {layout, dynamic, bindings, event}   from 'arva-js/layout/Decorators.js';
import {BaseIcon}                           from '../icons/views/BaseIcon';


/**
 * Radio buttons used for selecting mutually exclusive options
 *
 * @example
 * radioButtons = new RadioButtons({
     *     buttons: [{icon: CloudIcon, text: 'Turn on the AC', selected: true},
     *         {icon: HomeIcon, text: 'Pick up the mail'},
     *         {icon: Trash2Icon, text: 'Take a hike'},
     *         {icon: BadgeIcon, text: 'Jump high enough'}]
     * });
 *
 * @param {Object} options Construction options
 * @param {Array} [options.buttons] Array containing settings for each radio button that will be included
 *        in the RadioButton instance created. These settings include:
 *             -icon: (optional) the class of the icon to be used in the radio button (the class in which
 *                  the RadioButtons instance is created needs to import the icon class selected here)
 *             -text: the text which will appear in the radio button
 *             -selected: (optional) boolean used to determine which radio button will be selected initially
 *                  (only the first occurrence of selected: true is taken into consideration;
 *                  subsequent occurrences are ignored)
 */
@dynamic(() =>
    bindings.setup({
        buttons: [{text: '', icon: BaseIcon, selected: false}],
        activeColor: Colors.PrimaryUIColor,
        activeIndex: 0
    })
)
export class RadioButtons extends Clickable {


    @bindings.trigger()
    setupActiveIndex(options, defaultOptions) {
        let {buttons = defaultOptions.buttons} = options;
        let currentActiveItemIndex = buttons.findIndex(({selected}) => selected);
        if (currentActiveItemIndex === -1) {
            buttons[options.activeIndex].active = true;
        }

        if (currentActiveItemIndex !== -1) {
            options.activeIndex = currentActiveItemIndex;
        }
    }

    @layout.size(2, (width, height) => height - 64)
        .origin(0.5, 0.5)
        .align(0, 0.5)
        .translate(24, 0, 30)
    line = Surface.with({
        properties: {
            backgroundColor: this.options.activeColor
        }
    });

    @layout.dock.top()
        .size(undefined, 64)
        .translate(0, 0, 0)
    buttons = this.options.buttons.map(({icon, text, selected}, index) =>
        event.on('chosen', () => this._handleItemActive(index))(
            RadioButton.with({
                icon: icon,
                text: text,
                selected: this.inputOptions.buttons[index].selected
            })
        )
    );


    _handleItemActive(activeIndex) {
        /* If not changed, then return */
        if(activeIndex === this.options.activeIndex){
            return;
        }
        this.options.activeIndex = activeIndex;
        this._eventOutput.emit('valueChange', activeIndex);
        for (let [index, button] of this.buttons.entries()) {
            button.options.selected = index === parseInt(activeIndex);
        }
    }
}