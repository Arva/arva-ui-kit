/**
 * Created by vlad on 11/10/2016.
 */

import Surface              from 'famous/core/Surface.js';
import BkImageSurface       from 'bizboard/famous-bkimagesurface';

import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {Button}             from '../buttons/Button.js';
import {ListElementText}    from './ListElementText.js';
import {UISmallGray}        from '../text/UISmallGray.js';

import {elementHeight}      from './ListElement.js';

export class ListElementCard extends Button {

    @layout.fullSize()
    background = new Surface({
        properties: {
            backgroundColor: this.options.backgroundColor || 'rgb(255, 255, 255)',
            borderRadius: this.options.roundedCorners ? '4px' : '0px'
        }
    });

    constructor(options = {}) {
        super(options);

        if (this.options.image) {
            this.addRenderable(
                new BkImageSurface({
                    content: this.options.image,
                    sizeMode: BkImageSurface.SizeMode.ASPECTFILL,
                    properties: {
                        borderTopLeftRadius: this.options.roundedCorners ? '4px' : '',
                        borderBottomLeftRadius: this.options.roundedCorners ? '4px' : ''
                    }
                }), 'image',
                layout.dock.left(),
                layout.stick.center(),
                layout.size(elementHeight, elementHeight)
            );

            if (this.options.profileImage) {
                this.image.setProperties({borderRadius: '50%'});
                this.decorateRenderable('image',
                    layout.dock.left(elementHeight),
                    layout.stick.right(),
                    layout.size(48, 48)
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
                    lineHeight: elementHeight + 'px'
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
                        borderTopRightRadius: this.options.roundedCorners ? '4px' : '',
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