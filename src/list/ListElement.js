/**
 * Created by vlad on 12/10/2016.
 */

import {layout}             from 'arva-js/layout/Decorators.js';

import {Clickable}          from '../components/Clickable.js';
import {ListElementCard}    from './ListElementCard.js';
import {ImageButton}        from '../buttons/ImageButton.js';
import {DoneIcon}           from '../icons/DoneIcon.js';

export class ListElement extends Clickable {

    @layout.draggable({xRange: [0, 128], projection: 'x'})
    @layout.size(undefined, 64)
    @layout.translate(0, 0, 10)
    surface = new ListElementCard({
        image: this.options.image,
        text: this.options.text,
        profileImage: this.options.profileImage
    });

    @layout.dock.right()
    @layout.size(64, 64)
    button = new ImageButton({
        icon: DoneIcon,
        properties: {color: 'red'},
    })

}