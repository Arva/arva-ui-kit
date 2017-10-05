/**
 * Created by Manuel on 28/06/16.
 */

import _merge from 'lodash/merge.js';

export let Colors = {
    PrimaryUIColor: 'rgb(0, 188, 235)',
    SecondaryUIColor: 'rgb(170, 170, 170)',
    TertiaryUIColor: 'rgb(170, 170, 170)',
    QuaternaryUIColor: 'rgb(170, 170, 170)',

    BasicTextColor: 'rgb(0, 0, 0)',
    ModestTextColor: 'rgb(170, 170, 170)',
    ArticleTextColor: 'rgb(20, 20, 20)',
    ImageTextColor: 'rgb(255, 255, 255)',
    UIBarTextColor: 'rgb(255, 255, 255)',

    White: 'rgb(255, 255, 255)',
    Black: 'rgb(0, 0, 0)',
    Gray: 'rgb(170, 170, 170)',
    LightGray: 'rgb(245, 245, 245)',
    VeryLightGray: 'rgb(250, 250, 250)'
};


export function setColors(...colors) {
    _merge(Colors, ...colors);
}