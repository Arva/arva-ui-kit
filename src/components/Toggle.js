
import Easing               from 'famous/transitions/Easing.js';

import AnimationController  from 'famous-flex/AnimationController.js';

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {WhiteTextButton}    from '../buttons/WhiteTextButton.js';
import {ColoredTextButton}    from '../buttons/ColoredTextButton.js';

export class Toggle extends View {
    @layout.stick.center()
    @layout.size(true, true)
    @layout.translate(0,0,20)
    @layout.animate({
        animation: AnimationController.Animation.Fade,
        showInitially: true,
        transition: {
            duration: 200,
            curve: Easing.outCubic
        }
    })
    inactiveButton = new WhiteTextButton({
        ...this.options,
        backgroundProperties: this.options.inactiveBackgroundProperties,
        properties: this.options.inactiveProperties ? this.options.inactiveProperties : this.options.properties
    });

    @layout.stick.center()
    @layout.size(true, undefined)
    @layout.translate(0,0,10)
    @layout.animate({
        animation: AnimationController.Animation.Fade,
        showInitially: false,
        transition: {
            duration: 200,
            curve: Easing.outCubic
        }
    })
    activeButton = new ColoredTextButton({
        ...this.options,
        backgroundProperties: this.options.activeBackgroundProperties,
        properties: this.options.activeProperties
    });

    constructor(options={}){
        options.initialButton = options.active ? ColoredTextButton : WhiteTextButton;
        super(combineOptions({
            makeRipple: false,
            active: false,
            rounded: false
        }, options));

        this.activeButton.on('click', this.disable.bind(this));
        this.inactiveButton.on('click', this.enable.bind(this));

        if (this.options.active) this.enable()
    }

    disable(){
        this.options.active = false;
        this.showRenderable('inactiveButton');
        this.hideRenderable('activeButton');
        this._eventOutput.emit('state-changed', this.options.active)
    }

    enable(){
        this.options.active = true;
        this.showRenderable('activeButton');
        this.hideRenderable('inactiveButton');
        this._eventOutput.emit('state-changed', this.options.active);
    }

    getState(){
        return this.options.active;
    }
}


/*

1. replace the renderable each time
2. show / hide renderables on click
3. layer the renderables and change zTranslate on click
4. fancier animations

 */