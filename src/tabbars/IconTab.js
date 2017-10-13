/**
 * Created by Manuel on 09/09/16.
 */

import Easing                           from 'arva-js/famous/transitions/Easing.js';
import ImageSurface                     from 'arva-js/famous/surfaces/ImageSurface.js';
import {layout, flow, bindings, dynamic}from 'arva-js/layout/Decorators';

import {Button}                         from '../buttons/Button.js';

import {flowStates}                     from 'arva-js/layout/FlowStates.js';

import {AccountIcon}                    from '../icons/AccountIcon.js';
import {Tab}                            from './Tab';
import {Colors}                         from '../defaults/DefaultColors';

const flowOptions = {transition: {curve: Easing.outCubic, duration: 200}};


/**
 * IconTab that displays an Icon
 * @param {Object} [options] Construction options
 * @param {String} [options.image] The optional image to display
 * @param {Number} [options.icon] The icon's renderable Class, won't be used when an image is defined. Defaults to AccountIcon
 */
@bindings.setup({
    icon: AccountIcon,
    makeRipple: false,
    useBackground: false,
    useBoxShadow: false,
    active: false,
    passiveOpacity: 1,
    properties: {color: 'white', activeColor: Colors.PrimaryUIColor}
})
export class IconTab extends Button {
    _hover = true;

    @layout.translate(0, 0, 30)
    @layout.size(24, 24)
    @layout.origin(0.5,0.5)
    @layout.align(0.5,0.5)
    @flow.defaultOptions(flowOptions)
    @dynamic(({active, passiveOpacity}) =>
        layout.opacity(active ? 0 : passiveOpacity)
    )
    @flowStates.fade('inactive', {opacity: 0}, flowOptions)
    @flowStates.fade('active', {opacity: 1}, flowOptions)
    icon = this.options.image ? ImageSurface.with({content: this.options.image}) : this.options.icon.with({color: this.options.properties.color});

    @layout.translate(0, 0, 40)
    @layout.size(24, 24)
    @layout.origin(0.5,0.5)
    @layout.align(0.5,0.5)
    @flow.defaultOptions(flowOptions)
    @dynamic(({active}) =>
        layout.opacity(active ? 1 : 0)
    )
    iconOverlay = this.options.image ? ImageSurface.with({content: this.options.image}) : this.options.icon.with({color: this.options.properties.activeColor || 'black'});

    getSize(){
        return [24,48];
    }
    /* TODO: Think about a better solution to multiple inheritance problem than the current solution */

    _handleTapStart() {
        Tab.prototype._handleTapStart.call(this, ...arguments);
    }

    _handleTapEnd() {
        Tab.prototype._handleTapEnd.call(this, ...arguments);
    }




    _setActive() {
        Tab.prototype._setActive.call(this);
    }

    _setInactive() {
        Tab.prototype._setInactive.call(this);
    }
    
    
    activate() {
        Tab.prototype.activate.call(this);
    }

    deactivate() {
        Tab.prototype.deactivate.call(this);
    }

    

    getSize() {
        return [40, 32];
    }
}

