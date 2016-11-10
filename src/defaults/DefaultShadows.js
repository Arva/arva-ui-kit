/**
 * Created by lundfall on 15/09/16.
 */

import RGBColor                                     from 'rgbcolor';


let globalShadowType = 'soft';

/**
 * @example
 * new Surface({properties: {boxShadow: ''}}
 *
 * Gets a CSS box-shadow that is coherent with the rest of the app, based on certain options
 *
 * @param {Object} options
 * @param {Boolean} [options.onlyForShadowType] If set to 'hard' or 'soft' then will only return a shadow if the current
 * setting is this particular shadow
 * @param {String} [options.color] The rgb(a) color that is being used for the element casting the shadow
 * @param {String} [options.type] The type of shadow. If no type is specified, uses the globally set shadow
 * @param {Boolean} [options.inset] Defaults to false. Creates an inset box shadow
 * @param {Boolean} [options.fullWidth] Defaults to false for soft shadows. Hard shadows always have full width.
 * @returns {String} The box-shadow to set
 */
export function getShadow(options = {}){
    let {onlyForShadowType, color = 'white', inset = false, fullWidth = false, type} = options;
    if(onlyForShadowType && onlyForShadowType !== globalShadowType){
        return '';
    }
    switch (type || globalShadowType){
        case 'hard':
            return Shadows.getHardShadow(color, inset);
        case 'soft':
            return Shadows.getSoftShadow(color, inset, fullWidth);
        case 'none':
            return ''
    }
}

const rgbToRgba = (rgbString, alpha) => {
    let color = new RGBColor(rgbString);
    color.alpha = alpha;
    return color.toRGBA();
};

let colorIsWhite = (color) => color === 'white' || color === '#000000' || color === '#000' || color.replace(/ /g,'') === 'rgb(255,255,255)'
|| color.replace(/ /g,'').startsWith('rgba(255,255,255,');

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

    static getSoftShadow(color, inset = false, fullWidth = false) {
        let offset = fullWidth ? 0 : 8;
        if((!color || colorIsWhite(color))){
            return `0 ${offset}px 8px ${-offset}px rgba(0, 0, 0, 0.12) ${inset ? 'inset' : ''}`;
        } else {
            return `0 ${offset}px 8px ${-offset}px rgba(0, 0, 0, 0.16) ${inset ? 'inset' : ''}, 0 8px 8px ${fullWidth ? 0 : -8}px ${rgbToRgba(color, 0.16)} ${inset ? 'inset' : ''}`
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
