/**
 * Created by Manuel on 28/06/16.
 */
import _   from 'lodash';

export let Dimensions = {
    topBarHeight: 30,
    sideMenuOptions: {
        itemHeight: 44,
        itemMargin: 10,
        direction: 1
    }
};

export let TopBarHeight = Dimensions.topBarHeight;


export function setDimensions(...dimensions) {
    _.merge(Dimensions, ...dimensions);
}
