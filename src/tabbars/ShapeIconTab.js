/**
 * Created by Manuel on 09/09/16.
 */

import Easing                   from 'famous/transitions/Easing.js';
import ImageSurface             from 'famous/surfaces/ImageSurface.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {layout, flow, bindings} from 'arva-js/layout/Decorators.js';
import {flowStates}             from 'arva-js/layout/FlowStates.js';

import {IconTab}            from './IconTab.js';

const flowOptions = {transition: {curve: Easing.outCubic, duration: 200}};

//todo add different opacities
export class ShapeIconTab extends IconTab {

}