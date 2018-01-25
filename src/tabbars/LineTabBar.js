/**
 * Created by Manuel on 06/09/16.
 */
import {bindings, dynamic} from 'arva-js/layout/Decorators.js';
import {ShapeTabBar} from './ShapeTabBar';
import {Colors} from 'arva-kit/defaults/DefaultColors.js';


@dynamic(() =>
    bindings.setup({
        borderRadius: '0px',
        _shapeHeight: 4,
        tabOptions: {passiveColor: Colors.Gray, activeColor: Colors.PrimaryUIColor},
        _shapeYOffset: 18,
    })
)
export class LineTabBar extends ShapeTabBar {


}