/**
 * Created by manuel on 09-09-15.
 */

import {View}                   from 'arva-js/core/View.js';
import {Router}                 from 'arva-js/core/Router.js';
import {layout}                 from 'arva-js/layout/Decorators';
import {Injection}              from 'arva-js/utils/Injection.js';
import {TopMenuView}            from './TopMenuView.js';


export class TopMenu extends View {
    @layout.fullscreen
    topMenuView = new TopMenuView(this.options);
    
    constructor(options = {}) {
        super(options);

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
}
