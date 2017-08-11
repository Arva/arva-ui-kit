/**
 * Created by Manuel on 06/07/16.
 */


/********
 *
 * JO:
 *
 * Some icons have their colors defined using fill, some with stroke, replace both
 * Replace both hex codes and rgb / rgba values
 *
 */

const colorMatcher = new RegExp('(stroke|fill)="(#[A-Fa-f0-9]{6}|rgb\(.+\)|rgba\(.+\))"', 'gi');

export function replaceColors(svgImage = '', color = '#000000'){
    return svgImage.replace(colorMatcher, `$1="${color}"`);
}

