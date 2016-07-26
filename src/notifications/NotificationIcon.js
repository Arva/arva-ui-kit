import {layout}             from 'arva-js/layout/decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Button}             from '../buttons/Button.js';
import {DoneIcon}           from '../icons/angular/bold/DoneIcon.js';
import {PrimaryUIColor}     from '../defaults/DefaultColors.js';

export class NotificationIcon extends Button {

    @layout.size(24, 24)
    @layout.place('center')
    icon = new DoneIcon({
        color: PrimaryUIColor
    });

    constructor(options = {}) {
        super(combineOptions(options, {
                useBoxShadow: false,
                backgroundProperties: {
                    borderLeft: '1px solid rgb(230,230,230)',
                    borderRadius: '0px 4px 4px 0px'
                }
            })
        )
    }

}
