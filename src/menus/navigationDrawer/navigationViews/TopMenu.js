/**
 * Created by manuel on 09-09-15.
 */

import Surface                  from 'famous/core/Surface.js';
import {View}                   from 'arva-js/core/View.js';

import {Router}                 from 'arva-js/core/Router.js';
import {Injection}              from 'arva-js/utils/Injection.js';

import AnimationController      from 'famous-flex/AnimationController';
import RenderNode               from 'famous/core/RenderNode';
import Easing                   from 'famous/transitions/Easing';
import Draggable                from 'famous/modifiers/Draggable';
import StateModifier            from 'famous/modifiers/StateModifier';
import Transitionable           from 'famous/transitions/Transitionable';
import SnapTransition           from 'famous/transitions/SnapTransition';

import {TopMenuView}            from './TopMenuView.js';

export class TopMenu extends View {
    constructor(options = {}) {
        super(options);

        this._createRenderables(options);
        this.renderables.topMenuView.show(this.topMenuView);

        this.router = Injection.get(Router);
    }

    open() {
        this.topMenuView.open(...arguments);
    }

    close() {
        this.topMenuView.close(...arguments);
    }

    setTitle() {
        this.topMenuView.setTitle(...arguments);
    }

    getTitle() {
        this.topMenuView.getTitle(...arguments);
    }

    setRightButton(){
        this.topMenuView.setRightButton(...arguments);
    }

    setNewUser() {
        this.topMenuView.setNewUser(...arguments);
    }

    setUserNameEnabled(){
        this.topMenuView.setUserNameEnabled(...arguments);
    }

    setColors() {
        this.topMenuView.setColors(...arguments);
    }

    get isOpen() {
        return this.topMenuView.isOpen;
    }

    _createRenderables(options) {
        this.addRenderable(new AnimationController(),'topMenuView');
        this.topMenuView = new TopMenuView(options);
        this.topMenuView.pipe(this);
        this.topMenuView.pipe(this._eventOutput);

        this.layouts.push((context) => {
            context.set('topMenuView', {
                size: [context.size[0], context.size[1]],
                origin: [0, 0],
                align: [0, 0],
                translate: [0, 0, 50]
            });

        });
    }
}
