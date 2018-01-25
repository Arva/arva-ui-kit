/**
 * Created by vlad on 26/07/16.
 */

import RGBColor                                     from 'rgbcolor';
import {Surface}        from 'arva-js/surfaces/Surface.js';
import Easing                                       from 'famous/transitions/Easing.js';
import AnimationController                          from 'famous-flex/AnimationController.js';
import {View}                                       from 'arva-js/core/View.js';
import {layout}                                     from 'arva-js/layout/Decorators.js';
import {combineOptions}                             from 'arva-js/utils/CombineOptions.js';
import {Colors}                                     from '../defaults/DefaultColors.js';
import {
    UIBarHeight,
    UIBarThickHeight,
    UIBarPadding
}                                                   from '../defaults/DefaultDimensions.js';
import {getShadow}                                  from '../defaults/DefaultShadows.js';

const rgbToRgba = (rgbString, alpha) => {
    let color = new RGBColor(rgbString);
    color.alpha = alpha;
    return color.toRGBA();
};
const componentSwapTransition = {curve: Easing.outCubic, duration: 200};

@layout.dockPadding(0, UIBarPadding)
export class UIBar extends View {
    /**
     * Gets the settings depending on the variation
     * @param variation
     * @returns {*}
     */
    static getSettings(variation = 'white') {
        switch (variation) {
            default:
                console.log('Invalid variation selected. Falling back to default settings (white).');
            case 'white':
                return {
                    backgroundSettings: {
                        shadows: {
                            'softShadow': {boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.12)'},
                            'hardShadow': {boxShadow: '0px 2px 0px 0px rgba(0,0,0,0.12)'},
                            'noShadow': {boxShadow: ''},
                        },
                        backgroundColor: {backgroundColor: 'rgb(255, 255, 255)'}
                    }
                };
            case 'colored':
                return {
                    backgroundSettings: {
                        shadows: {
                            'softShadow': {boxShadow: `0px 0px 8px 0px rgba(0,0,0,0.12), 0px 0px 8px 0px ${rgbToRgba(Colors.PrimaryUIColor, 0.12)}`},
                            'hardShadow': {boxShadow: `0px 2px 0px 0px rgba(0,0,0,0.08), 0px 2px 0px 0px ${rgbToRgba(Colors.PrimaryUIColor, 0.08)}`},
                            'noShadow': {boxShadow: ``}
                        },
                        backgroundColor: {backgroundColor: Colors.PrimaryUIColor}
                    }
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
     *                  [new WhiteIconButton(), 'button2', 'right'],
     *                  [new WhiteTextButton(), 'icon3', 'left'],
     *                  [new ColoredIconButton(), 'button3', 'center']
     *              ]
     *          })
     */
    constructor(options = {}, extraRenderables) {
        let {backgroundProperties} = UIBar._computeSettings(options);

        super(combineOptions({
            backgroundProperties,
            autoColoring: true,
            centerItemSize: [~300, ~30]
        }, options), extraRenderables);

        let components = options.components;
        this.componentNames = {left: [], right: [], center: [], fill: []};
        for (let [renderable, renderableName, position] of components || []) {
            this.addComponent(renderable, renderableName, position);
        }
    }

    //TODO AddComponent is a hack that isn't needed anymore
    addComponent(renderable, renderableName, position, ...decorators) {
        if (!renderable) {
            console.warn(`Invalid Renderable (${renderableName}) passed to UIBar`);
            return;
        }
        this.componentNames[position].push(renderableName);
        if (this.options.autoColoring) {
            /* Only change color of renderables which have a setVariation method. */
            if (renderable.setVariation) {
                renderable.setVariation(this.options.variation);
            }
            renderable.options.uiBarVariation = this.options.variation;
            renderable.setColorBasedOnVariation && renderable.setColorBasedOnVariation();
        }
        if (position === 'center') {
            this.addRenderable(renderable, layout.stick.center().size(...this.options.centerItemSize), ...decorators);
            this.decorateRenderable(renderable, layout.animate({animation: AnimationController.Animation.Fade}));
        } else {
            this.addRenderable(renderable, layout.dock[position](true), ...decorators);
            this.decorateRenderable(renderable, layout.animate({animation: AnimationController.Animation.Fade}));
        }
        this[renderableName] = renderable;
    }

    removeAllComponents() {
        let {left, right, center, fill} = this.componentNames;
        while (left.length > 0) {
            this.removeRenderable(left.pop());
        }
        while (right.length > 0) {
            this.removeRenderable(right.pop());
        }
        while (center.length > 0) {
            this.removeRenderable(center.pop());
        }
        while (fill.length > 0) {
            this.removeRenderable(fill.pop());
        }

        return true;
    }

    removeComponents(position) {
        let currentComponents = this.componentNames[position];
        while (currentComponents.length > 0) {
            let renderableName = currentComponents.pop();
            this.renderables[renderableName] && this.removeRenderable(renderableName);
        }
        return true;
    }

    addComponents(position, components) {
        for (let i = 0; i < components.length; i++) {
            this.addComponent(components[i], position + 'Button' + i, position);
        }
        return true;
    }

    getComponents(position){
        let componentNames = this.componentNames[position];
        let components = [];
        if(componentNames){
            for(let componentName of componentNames){
                components.push(this[componentName])
            }
        }
        return components;
    }

    replaceComponent(oldRenderableName, newRenderable) {
        this.replaceRenderable(oldRenderableName, newRenderable);
    }

    getSize() {
        return [undefined, this.options.setThick ? UIBarThickHeight : UIBarHeight];
    }

    static _computeSettings(options) {
        /**
         * Selects which variation settings the UIBar should use.
         * variation option can be set to 'white' [default] or 'colored'.
         */
        let {backgroundSettings} = UIBar.getSettings(options.variation);

        /**
         * Selects which type of shadow the UIBar should have.
         * shadowType option can be set to softShadow or hardShadow.
         * By default no shadows are added.
         */
        let shadow;
        if (options.shadowType in backgroundSettings.shadows) {
            shadow = backgroundSettings.shadows[options.shadowType];
        } else {
            shadow = {boxShadow: getShadow({color: backgroundSettings.backgroundColor.backgroundColor, fullWidth: true})};
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

        return {backgroundProperties: {...shadow, ...topLine, ...bottomLine, ...backgroundSettings.backgroundColor}};
    }
}