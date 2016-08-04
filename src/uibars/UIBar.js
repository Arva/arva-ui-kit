/**
 * Created by vlad on 26/07/16.
 */

import RGBColor                                     from 'rgbcolor';
import Surface                                      from 'famous/core/Surface.js';
import {View}                                       from 'arva-js/core/View.js';
import {layout}                                     from 'arva-js/layout/Decorators.js';
import {combineOptions}                             from 'arva-js/utils/CombineOptions.js';
import {Colors}                                     from '../defaults/DefaultColors.js';
import {
    UIBarHeight,
    UIBarThickHeight,
    UIBarPadding
}                                                   from '../defaults/DefaultDimensions.js';

const rgbToRgba = (rgbString, alpha) => {
    let color = new RGBColor(rgbString);
    color.alpha = alpha;
    return color.toRGBA();
};

@layout.dockPadding(0, UIBarPadding)
export class UIBar extends View {
    /**
     * Gets the settings depending on the variation
     * @param variation
     * @returns {*}
     */
    static getSettings(variation) {
        variation = variation || 'white';
        switch (variation) {
            default:
                console.log('Invalid variation selected. Falling back to default settings (white).');
            case 'white':
                return {
                    backgroundSettings: {
                        shadows: {
                            'softShadow': {boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.12)'},
                            'hardShadow': {boxShadow: '0px 2px 0px 0px rgba(0,0,0,0.12)'}
                        },
                        backgroundColor: {backgroundColor: 'rgb(255, 255, 255)'}
                    }, opposingColor: Colors.PrimaryUIColor
                };
            case 'colored':
                return {
                    backgroundSettings: {
                        shadows: {
                            'softShadow': {boxShadow: `0px 0px 8px 0px rgba(0,0,0,0.12), 0px 0px 8px 0px ${rgbToRgba(Colors.PrimaryUIColor, 0.12)}`},
                            'hardShadow': {boxShadow: `0px 2px 0px 0px rgba(0,0,0,0.08), 0px 2px 0px 0px ${rgbToRgba(Colors.PrimaryUIColor, 0.08)}`}
                        },
                        backgroundColor: {backgroundColor: Colors.PrimaryUIColor}
                    },
                    opposingColor: 'rgb(255, 255, 255)'
                };
        }
    }

    @layout.size(undefined, undefined)
    @layout.translate(0, 0, -10)
    background = new Surface({properties: this.options.backgroundProperties});

    /**
     * Container that can be placed at the top or bottom of the view, in which you can put a collection of components like buttons, etc.
     *
     * @param {Object} options Construction options
     * @param {String} [options.variation] The variation of the UIBar ('white' [default], 'colored')
     * @param {String} [options.shadowType] The type of shadow to use ('noShadow' [default], 'softShadow', 'hardShadow')
     * @param {Boolean} [options.topLine] Add topLine
     * @param {Boolean} [options.bottomLine] Add bottomLine
     * @param {Boolean} [options.setThick] Set UIBar height to uiBarThickHeight from DefaultDimensions.js
     * @param {Array.Array} [options.component] Provide components to be added to the UIBar. Each component is passed
     *          as an Array in which the first element is the component itself, the second element is the name of the component,
     *          and the third element is docking side (should only be set to left, right, center, or fill).
     *          An example of how to add components:
     *          new UIBar({
     *              components: [
     *                  [new Surface(), 'icon1', 'right'],
     *                  [new ImageButton(), 'button2', 'right'],
     *                  [new textButton(), 'icon3', 'left'],
     *                  [new iconButton(), 'button3', 'center']
     *              ]
     *          })
     */
    constructor(options = {}) {
        let {backgroundProperties, opposingColor} = UIBar._computeSettings(options);

        super(combineOptions({
            backgroundProperties,
            autoColoring: true,
            opposingColor
        }, options));

        let components = options.components;
        for (let [renderable, renderableName, position] of components || []) {
            if (this.options.autoColoring) {
                if (renderable.setColor) {
                    renderable.setColor(opposingColor);
                } else if (renderable.setProperties) {
                    renderable.setProperties({color: opposingColor});
                }
            }
            if (position === 'center') {
                this.addRenderable(renderable, renderableName, layout.stick.center(), layout.size(~300, ~30));
            } else {
                this.addRenderable(renderable, renderableName, layout.dock[position](true));
            }
        }
    }

    getSize() {
        return [undefined, this.options.setThick ? UIBarThickHeight : UIBarHeight];
    }

    static _computeSettings(options) {
        /**
         * Selects which variation settings the UIBar should use.
         * variation option can be set to 'white' [default] or 'colored'.
         */
        let {backgroundSettings, opposingColor} = UIBar.getSettings(options.variation);

        /**
         * Selects which type of shadow the UIBar should have.
         * shadowType option can be set to softShadow or hardShadow.
         * By default no shadows are added.
         */
        let shadow;
        if (options.shadowType in backgroundSettings.shadows) {
            shadow = backgroundSettings.shadows[options.shadowType];
        } else {
            shadow = {};
            if (options.shadowType) {
                console.log('Invalid shadow selected. Falling back to default settings (noShadow).');
            }
        }

        /**
         * Adds topLine and/or bottomLine to the UIBar.
         * topLine and bottomLine boolean options can be set.
         * By default no lines are added.
         */
        let topLine = options.topLine ? {borderTop: '1px solid rgba(0, 0, 0, 0.1)'} : {};
        let bottomLine = options.bottomLine ? {borderBottom: '1px solid rgba(0, 0, 0, 0.1)'} : {};

        return {
            backgroundProperties: {...shadow, ...topLine, ...bottomLine, ...backgroundSettings.backgroundColor},
            opposingColor
        };
    }
}