/**
 * Created by Manuel on 08/07/16.
 */

import AnimationController      from 'famous-flex/AnimationController.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {layout, options}        from 'arva-js/layout/Decorators.js';
import {Clickable}              from '../components/Clickable.js';

import {HamburgerIcon}          from './angular/bold/HamburgerIcon.js';
import {ArrowleftIcon}          from './angular/bold/ArrowleftIcon.js';


export class ToggleIcon extends Clickable {

    @layout.fullscreen
    @layout.translate(0, 0, 20)
    toggleIcon = new AnimationController();

    constructor(options = {}){
        super(combineOptions(options, {
            firstIcon: HamburgerIcon,
            secondIcon: ArrowleftIcon
        }));

        this.firstIcon = new this.options.firstIcon({
            properties: {
                cursor: 'pointer'
            }
        });

        this.secondIcon = new this.options.secondIcon({
            properties: {
                cursor: 'pointer'
            }
        });

        this.toggleIcon.show(this.firstIcon);
        this.firstIcon.pipe(this.toggleIcon._eventOutput);
        this.secondIcon.pipe(this.toggleIcon._eventOutput);
    }

    /**
     * Open the top menu
     */
    toggle() {
        this.toggleIcon.halt();
        this.isState ? this.toggleIcon.show(this.firstIcon, ...arguments) : this.toggleIcon.show(this.secondIcon, ...arguments);
        this.isState = !this.isState;
    }

    _onClick(){
        this.toggle();
        this._eventOutput.emit('stateChange', this.isState);
        super._onClick();
    }


}