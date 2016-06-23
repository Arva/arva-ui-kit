/**
 * Created by tom on 23/06/16.
 */

import {AvenirLight}                  from '../fonts/AvenirLight.js';

// Designer's notes (charilaos@bizboard.nl):
//
// TYPEFACES UI
// Fonts that will be used: Avenir, Helvetica, FF DIN Alternate
// - [ ] UI bar title (bold)
// - [ ] UI regular (most text in UI)
// - [ ] UI small (second lines in list items etc)
// - [ ] UI small grey (reduced visual weight for less important stuff)
// - [ ] UI tiny (labels in grid view items or under icon tabs etc)
// - [ ] UI textual button primary
// - [ ] UI textual button secondary
//
// TYPEFACES TEXT
// Fonts that will be used: Avenir, Helvetica, Georgia
// - [ ] body
// - [ ] H1
// - [ ] H2
// - [ ] H3
// - [ ] Captions
// - [ ] Quotes
// - [ ] Date&time/location/person label (grey caps)
//
// TYPEFACES IMPACT (huge centered titles, over header images etc)
// Fonts that will be used: Futura, Gill Sans
// - [ ] Huge
// - [ ] Big

export let fonts = {
    sans1: AvenirLight,
    sans2: AvenirLight,
    sans3: AvenirLight,
    serif: AvenirLight
};

export default typeFaces = {
    UIBarTitle: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'bold', color: 'rgb(0, 0, 0)'},
    UIRegular: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)'},
    UISmall: {fontFamily: fonts.sans1, fontSize: 14, fontWeight: 'normal', color: 'rgb(0, 0, 0)'},
    UISmallGrey: {fontFamily: fonts.sans1, fontSize: 14, fontWeight: 'normal', color: 'rgb(23, 23, 23)'},
    UITiny: {fontFamily: fonts.sans1, fontSize: 12, fontWeight: 'normal', color: 'rgb(0, 0, 0)'},
    UITextualButtonPrimary: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)'},
    UITextualButtonSecondary: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)'},


    TextBody: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)'},
    TextH1: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)'},
    TextH2: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)'},
    TextH3: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)'},
    TextCaptions: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)'},
    TextQuotes: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)'},
    TextLabel: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(23, 23, 23)', textTransform: 'uppercase'},

    ImpactHuge: {fontFamily: fonts.sans1, fontSize: 22, fontWeight: 'normal', color: 'rgb(0, 0, 0)'},
    ImpactBig: {fontFamily: fonts.sans1, fontSize: 20, fontWeight: 'normal', color: 'rgb(0, 0, 0)'}
};

export function swapFonts(previousFont, newFont) {
    for(let key in typeFaces) {
        let typeFace = typeFaces[key];
        if(typeFace.fontFamily === previousFont) {
            typeFace.fontFamily = newFont;
        }
    }
}