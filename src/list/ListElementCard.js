/**
 * Created by vlad on 11/10/2016.
 */

import Surface              from 'famous/core/Surface.js';
import BkImageSurface       from 'famous-bkimagesurface/BkImageSurface.js';

import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {Button}             from '../buttons/Button.js';
import {ListElementText}    from './ListElementText.js';
import {UISmallGray}        from '../text/UISmallGray.js';

export class ListElementCard extends Button {

    constructor(options = {}) {
        super(combineOptions({
            variation: 'noShadow',
            backgroundProperties: {
                backgroundColor: 'rgb(255, 255, 255)',
                borderRadius: '0px'
            }
        }, options));

        if (this.options.image) {
            this.addRenderable(
                new BkImageSurface({
                    content: this.options.image,
                    sizeMode: BkImageSurface.SizeMode.ASPECTFILL,
                }), 'image',
                layout.dock.left(),
                layout.stick.center(),
                layout.size(this.options.elementHeight, this.options.elementHeight)
            );

            if (this.options.profileImage) {
                this.image.setProperties({borderRadius: '50%'});
                this.decorateRenderable('image',
                    layout.dock.left(this.options.elementHeight),
                    layout.stick.right(),
                    layout.size(this.options.elementHeight - 16, this.options.elementHeight - 16)
                );
            }
        }

        if (this.options.icon) {
            this.addRenderable(
                new this.options.icon(), 'icon',
                layout.dock.left(40),
                layout.stick.right(),
                layout.size(24, 24)
            );
        }

        this.addRenderable(
            new ListElementText({
                text: this.options.text,
                previewText: this.options.previewText,
                bold: this.options.bold
            }), 'text',
            layout.stick.center(),
            layout.size(true, true),
            layout.dock.left()
        );

        this.addRenderable(
            new UISmallGray({
                content: this.options.sideText,
                properties: {
                    paddingRight: '16px',
                    cursor: 'pointer',
                    lineHeight: this.options.elementHeight + 'px',
                    whiteSpace: 'nowrap'
                }
            }), 'sideText',
            layout.size(~140, ~14),
            layout.dock.right()
        );

        if (this.options.statusColor) {
            this.addRenderable(
                new Surface({
                    properties: {
                        width: 0,
                        height: 0,
                        borderStyle: 'solid',
                        borderWidth: '0 16px 16px 0',
                        borderColor: `transparent ${this.options.statusColor} transparent transparent`
                    }
                }), 'triangle',
                layout.size(16, 16),
                layout.stick.topRight()
            );
        }
    }

}