/**
 * Created by Manuel on 06/07/16.
 */

/* Todo check what the use was of this function*/
// export function replaceColors(svgImage = '', color = '#000000'){
//     return `${svgImage.replace(/#000000/g, color)}`
// }

/* Todo check if we can get this working*/
// export function replaceColors(svgImage = '', color = '#000000'){
//     return `${svgImage.replace(/^#[0-9a-f]{3,6}$/g, color)}`
// }

export function replaceColors(svgImage = '', color = '#000000'){
    /* We need to find the 'fill="#' part of the svg and replace the hex color, e.g. #000000,
    therefore the required index is searchString.length - 1. */
    let searchString = 'fill="#';
    let hexCollorLength = 7;
    let index = svgImage.indexOf(searchString) + searchString.length - 1;
    let replaceAt = (string, index, replacement) => {
        return string.substr(0, index) + replacement + string.substr(index + hexCollorLength);
    };
    let newSvgImage = replaceAt(svgImage, index, color);
    return newSvgImage;
}