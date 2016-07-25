/**
 * Created by Manuel on 28/06/16.
 */

import _                    from 'lodash';

export let colors = {
    Red: '#F00',
    White: '#FFF',
    Black: '#000',
    Dark: '#000',
    Grey: '#CCC'
};

export let Red   = colors.Red;
export let White = colors.White;
export let Black = colors.Black;
export let Dark  = colors.Dark;
export let Grey  = colors.Grey;

export let IconColor = colors.White;

export let Colors = {
    PrimaryUIColor: 'rgb(0, 188, 235)',
    SecondaryUIColor: 'rgb(170, 170, 170)',
    TertiaryUIColor: 'rgb(170, 170, 170)',
    QuaternaryUIColor: 'rgb(170, 170, 170)',

    BasicTextColor: 'rgb(0, 0, 0)',
    ModestTextColor: 'rgb(170, 170, 170,)',
    ArticleTextColor: 'rgb(20, 20, 20,)',
    ImageTextColor: 'rgb(255, 255, 255,)',
    UIBarTextColor: 'rgb(255,255,255)'
};

export function setColors(...colors) {
    _.merge(Colors, ...colors);
}

export let PrimaryUIColor     = Colors.PrimaryUIColor;
export let SecondaryUIColor   = Colors.SecondaryUIColor;
export let TertiaryUIColor    = Colors.TertiaryUIColor;
export let QuaternaryUIColor  = Colors.QuaternaryUIColor;
export let BasicTextColor     = Colors.BasicTextColor;
export let ModestTextColor    = Colors.ModestTextColor;
export let ArticleTextColor   = Colors.ArticleTextColor;
export let ImageTextColor     = Colors.ImageTextColor;