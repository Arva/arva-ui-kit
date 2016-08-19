/**
 * Created by tom on 19/08/16.
 */

import {View}                   from 'arva-js/core/View.js';
import {layout}                 from 'arva-js/layout/Decorators.js';
import {TypeFaces}              from 'arva-kit/defaults/DefaultTypeFaces.js';
import {SingleLineInputSurface} from './SingleLineInputSurface.js';

export class SearchBar extends View {
    @layout.fullSize()
    input = new SingleLineInputSurface({ properties: TypeFaces.UISmallGrey });
}