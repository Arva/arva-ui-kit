/**
 * Created by Manuel on 06/07/16.
 */


export function replaceColors(svgImage = '', color = '#000000'){
    return `${svgImage.replace(/#000000/g, color)}`
}