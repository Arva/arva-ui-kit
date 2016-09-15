/**
 * Created by lundfall on 15/09/16.
 */

import RGBColor                                     from 'rgbcolor';


let globalShadowType = 'soft';

export function getShadow({onlyForShadowType, color = 'white', inset = false}){
    if(onlyForShadowType && onlyForShadowType !== globalShadowType){
        return '';
    }
    switch (globalShadowType){
        case 'hard':
            return Shadows.getHardShadow(color, inset);
        case 'soft':
            return Shadows.getSoftShadow(color, inset);
        case 'none':
            return ''
    }
}

const rgbToRgba = (rgbString, alpha) => {
    let color = new RGBColor(rgbString);
    color.alpha = alpha;
    return color.toRGBA();
};

let colorIsWhite = (color) => color === 'white' || color === '#000000' || color === '#000' || color === 'rgb(0,0,0)' 
|| color.startsWith('rgba(0,0,0,');

/* Override these methods to make your own hard/soft shadows*/
export class Shadows {
    static getHardShadow(color, inset = false) {
        if((!color || colorIsWhite(color))){
            return `0 2px 0px 0px rgba(0, 0, 0, 0.12) ${inset ? 'inset' : ''}`;
        } else {
            if(inset){
                return `0 2px 0px 0px rgba(0, 0, 0, 0.12) inset`;
            } else {
                return `0 2px 0px 0px rgba(0, 0, 0, 0.08), 0 2px 0px 0px ${rgbToRgba(color, 0.08)} ${inset ? 'inset' : ''}`;
            }
        }
    }

    static getSoftShadow(color, inset = false) {
        if((!color || colorIsWhite(color))){
            return `0 8px 8px -8px rgba(0, 0, 0, 0.12) ${inset ? 'inset' : ''}`;
        } else {

            return `0 8px 8px -8px rgba(0, 0, 0, 0.16) ${inset ? 'inset' : ''}, 0 8px 8px -8px ${rgbToRgba(color, 0.16)} ${inset ? 'inset' : ''}`
        }
    }
}



export function getShadowType() {
    return globalShadowType;
}
/**
 * Sets the shadow type that the components will use
 * @param {String} shadowType. Can be 'hard' or 'soft', or 'none'
 */
export function setShadowType(shadowType) {
    globalShadowType = shadowType;
}
