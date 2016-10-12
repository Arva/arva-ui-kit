/**
 * Created by vlad on 11/10/2016.
 */

import Surface              from 'famous/core/Surface.js';
import BkImageSurface       from 'bizboard/famous-bkimagesurface';

import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {Clickable}          from '../components/Clickable.js';
import {UIRegular}          from '../text/UIRegular.js';

export class ListElementCard extends Clickable {

    @layout.fullSize()
    background = new Surface({properties: {backgroundColor: 'rgb(255, 255, 255)'}});

    constructor(options = {}) {
        super(combineOptions({
            text: 'No text set'
        }, options));

        if (this.options.image) {
            this.addRenderable(
                new BkImageSurface({
                    content: this.options.image,
                    sizeMode: BkImageSurface.SizeMode.ASPECTFILL
                }), 'image',
                layout.dock.left(),
                layout.stick.center(),
                layout.size(64, 64)
            );

            if (this.options.profileImage) {
                this.image.setProperties({borderRadius: '50%'});
                this.decorateRenderable('image',
                    layout.dock.left(64),
                    layout.size(48, 48),
                    layout.stick.right()
                );
            }
        }

        this.addRenderable(
            new UIRegular({
                content: this.options.text,
                properties: {
                    paddingLeft: '16px',
                    cursor: 'pointer',
                    lineHeight: '64px'
                }
            }), 'text',
            layout.size(undefined, 64),
            layout.dock.left()
        );
    }

}