/**
 * Created by rbu on 06-11-15.
 */
import Surface          from 'famous/core/Surface.js';
import {View}           from 'arva-js/core/View.js';
import {UIRegular}     from '../../../defaults/DefaultTypefaces.js';

export class MenuItem extends View {
    constructor(options = {}) {
        super(options);

        this.addRenderable(new Surface({
            content: options.text,
            properties: {
                color: options.textColor,
                fontSize: UIRegular.properties.fontSize,
                fontFamily: UIRegular.properties.fontFamily,
                lineHeight: `${options.sideMenuOptions.itemHeight-4}px`,
                pointerEvents: options.separation ? 'none' : 'initial'

            }
        }), 'textSurface');

        this.addRenderable(new Surface({
            properties: {
                pointerEvents: options.separation ? 'none' : 'initial'
            }
        }), 'clickOverlay');

        this.layouts.push((context)=> {
            let clickOverlaySize = [context.size[0] * 0.9, 44];

            context.set('clickOverlay', {
                size: clickOverlaySize,
                align: [0.1, 0.5],
                origin: [0, 0.5],
                translate: [0, 0, 40]
            });


            context.set('textSurface', {
                size: [context.size[0] * 0.9, 17],
                align: [0.1, 0.2],
                origin: [0, 0.2],
                translate: [0, 0, 10]

            });
        });
    }

    setSelected(selected) {
        this.renderables.textSurface.setProperties({color: selected ? this.options.colors.MenuTextColorHighlight : this.options.colors.MenuTextColor});
    }

    getSize() {
        return [undefined, this.options.separation ? 15 : 44];
    }

}