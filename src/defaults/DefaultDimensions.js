/**
 * Created by Manuel on 28/06/16.
 */
import _   from 'lodash';

export let Dimensions = {
    ComponentHeight: 48,
    ComponentPadding: 12,

    UIBarHeight: 48,
    UIBarThickHeight: 64,
    UIBarPadding: 4,

    topBarHeight: 30,
    sideMenuOptions: {
        itemHeight: 48,
        itemMargin: 0,
        direction: 1
    }
};

export let ComponentHeight = Dimensions.ComponentHeight;
export let ComponentPadding = Dimensions.ComponentPadding;

export let UIBarHeight = Dimensions.UIBarHeight;
export let UIBarThickHeight = Dimensions.UIBarThickHeight;
export let UIBarPadding = Dimensions.UIBarPadding;

export let TopBarHeight = Dimensions.topBarHeight;


export function setDimensions(...dimensions) {
    _.merge(Dimensions, ...dimensions);
}
