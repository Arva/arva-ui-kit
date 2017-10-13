/**
 * Created by rbu on 06-11-15.
 */
import Surface          from 'arva-js/famous/core/Surface.js';
import {View}           from 'arva-js/core/View.js';

import {combineOptions} from 'arva-js/utils/CombineOptions.js';
import {layout}         from 'arva-js/layout/Decorators.js';

import {UIRegular}      from '../../../defaults/DefaultTypefaces.js';
import {Text}           from '../../../text/Text.js';
import {Colors}         from '../../../defaults/DefaultColors.js';

@layout.dockPadding(0, 0, 0, 16)
export class MenuItem extends View {


    @layout.size(0.9, 17)
    @layout.dock.fill()
    @layout.translate(0, 0, 10)
    textSurface = new Text(combineOptions(UIRegular, {
        content: this.options.text,
        properties: {
            color: this.options.textColor,
            pointerEvents: this.options.separation ? 'none' : 'initial'
        }
    }));

    constructor(options = {}) {
        super(combineOptions({
            textColor: 'white',
            highlightedTextColor: Colors.ModestTextColor
        }, options));

        this.addRenderable(new Surface({
            properties: {
                pointerEvents: options.separation ? 'none' : 'initial'
            }
        }), 'clickOverlay');

        this.layout.once('layoutstart', ({size: [_,height]}) => {
            this.textSurface.setProperties({lineHeight: `${height}px`});
        });

        this.layouts.push((context)=> {
            let clickOverlaySize = [context.size[0] * 0.9, 44];

            context.set('clickOverlay', {
                size: clickOverlaySize,
                align: [0.1, 0.5],
                origin: [0, 0.5],
                translate: [0, 0, 40]
            });

        });
    }

    setSelected(selected) {
        this.textSurface.setProperties({color: selected ? this.options.highlightedTextColor : this.options.textColor});
    }

    getSize() {
        return [undefined, this.options.separation ? 15 : 44];
    }

}