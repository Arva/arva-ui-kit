/**
 * Created by rbu on 06-11-15.
 */
import Surface          from 'famous/core/Surface.js';
import {View}           from 'arva-js/core/View.js';
import {UIRegular}     from '../../defaults/DefaultTypefaces.js';

export class MenuItem extends View {
    constructor(options = {}, data = {}) {
        super(options);
        this.data = data;

        this.addRenderable(new Surface({
            content: data.text,
            properties: {
                color: options.colors.MenuTextColor,
                fontSize: UIRegular.fontSize,
                fontFamily: UIRegular.fontFamily,
                lineHeight: UIRegular.lineHeight,
                pointerEvents: data.separation ? 'none' : 'initial'

            }
        }), 'textSurface');

        this.addRenderable(new Surface({
            properties: {
                pointerEvents: data.separation ? 'none' : 'initial'
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
        return [undefined, this.data.separation ? 15 : 44];
    }

}