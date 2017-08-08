/**
 * Created by Manuel on 06/09/16.
 */

import Surface              from 'famous/core/Surface.js';
import Easing               from 'famous/transitions/Easing.js';

import {View}               from 'arva-js/core/View.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {flow, layout}       from 'arva-js/layout/Decorators.js';
import {flowStates}         from 'arva-js/layout/FlowStates.js';
import {Tab}                from './Tab.js';
import {Colors}             from 'arva-kit/defaults/DefaultColors.js';
import {AccountIcon}        from 'arva-kit/icons/AccountIcon.js';

const flowOptions = {transition: {curve: Easing.outCubic, duration: 200}};

export class IconTextTab extends Tab {

    @layout.fullSize()
    iconAndText = new IconAndText(this.options);

    constructor(options = {}){
        super(combineOptions(options,{
            icon: AccountIcon,
            properties: {
                color: options.inActiveColor
            }
        }));
    }

    setActive(){
        this.iconAndText.setRenderableFlowState('textOverlay', 'active');
        this.iconAndText.setRenderableFlowState('iconOverlay', 'active');
    }

    setInactive(){
        this.iconAndText.setRenderableFlowState('textOverlay', 'inactive');
        this.iconAndText.setRenderableFlowState('iconOverlay', 'inactive');
    }

    _activate(){
        this.iconAndText.setRenderableFlowState('textOverlay', 'inactive');
        this.iconAndText.setRenderableFlowState('iconOverlay', 'inactive');
        this.iconAndText.setRenderableFlowState('text', 'active');
        this.iconAndText.setRenderableFlowState('icon', 'active');
    }

    _deactivate(){
        this.iconAndText.setRenderableFlowState('text', 'inactive');
        this.iconAndText.setRenderableFlowState('icon', 'inactive');
    }
}


@layout.dockPadding(0,0,2,0)
class IconAndText extends View {

    @layout.translate(0, -18, 30)
    @layout.stick.bottom()
    @layout.size(24, 24)
    @layout.opacity(0.7)
    @flow.defaultOptions(flowOptions)
    @flowStates.fade('active', {opacity: 1}, flowOptions)
    @flowStates.fade('inactive', {opacity: 0.7}, flowOptions)
    icon = new this.options.icon({
        color: Colors.PrimaryUIColor
    });

    @layout.translate(0, -18, 40)
    @layout.stick.bottom()
    @layout.size(24, 24)
    @layout.opacity(0.7)
    @flow.defaultOptions(flowOptions)
    @flowStates.fade('active', {opacity: 1}, flowOptions)
    @flowStates.fade('inactive', {opacity: 0.7}, flowOptions)
    iconOverlay = new this.options.icon({
        color: Colors.Gray
    })

    // @layout.translate(0, -2, 30)
    // @layout.stick.bottom()
    // @layout.size(~300, 10)
    // // @layout.origin(0.5, 0)
    // // @layout.align(0.5, 0)
    // @layout.opacity(0.7)
    // @flow.defaultOptions(flowOptions)
    // @flowStates.fade('active', {opacity: 1}, flowOptions)
    // @flowStates.fade('inactive', {opacity: 0.7}, flowOptions)
    // text = new Surface(combineOptions(this.options, {
    //     properties: {
    //         fontSize: "10px"
    //     }
    // }));
    //
    // @layout.translate(0, -2, 40)
    // @layout.stick.bottom()
    // @layout.size(~300, 10)
    // // @layout.origin(0.5, 0)
    // // @layout.align(0.5, 0)
    // @layout.opacity(0)
    // @flow.defaultOptions(flowOptions)
    // @flowStates.fade('active', {opacity: 1}, flowOptions)
    // @flowStates.fade('inactive', {opacity: 0}, flowOptions)
    // textOverlay = new Surface(combineOptions(this.options,{properties: {
    //     color: this.options.activeColor,
    //     fontSize: "10px"
    // }}));

}