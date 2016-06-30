/**
 * Created by tom on 23/06/16.
 */

import AvenirLight                  from '../fonts/AvenirLight.js';

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


export let TypeFaces = {
    UIBarTitle: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'bold', color: 'rgb(0, 0, 0)', lineHeight: '100%'},
    UIRegular: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)', lineHeight: '100%'},
    UISmall: {fontFamily: fonts.sans1, fontSize: 14, fontWeight: 'normal', color: 'rgb(0, 0, 0)', lineHeight: '100%'},
    UISmallGrey: {fontFamily: fonts.sans1, fontSize: 14, fontWeight: 'normal', color: 'rgb(23, 23, 23)', lineHeight: '100%'},
    UITiny: {fontFamily: fonts.sans1, fontSize: 12, fontWeight: 'normal', color: 'rgb(0, 0, 0)', lineHeight: '100%'},
    UITextualButtonPrimary: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)', lineHeight: '100%'},
    UITextualButtonSecondary: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)', lineHeight: '100%'},

    TextBody: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)', lineHeight: '100%'},
    TextH1: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)' , lineHeight: '100%'},
    TextH2: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)', lineHeight: '100%'},
    TextH3: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)', lineHeight: '100%'},
    TextCaptions: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)', lineHeight: '100%'},
    TextQuotes: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(0, 0, 0)', lineHeight: '100%'},
    TextLabel: {fontFamily: fonts.sans1, fontSize: 17, fontWeight: 'normal', color: 'rgb(23, 23, 23)', textTransform: 'uppercase', lineHeight: '100%'},

    ImpactHuge: {fontFamily: fonts.sans1, fontSize: 22, fontWeight: 'normal', color: 'rgb(0, 0, 0)', lineHeight: '100%'},
    ImpactBig: {fontFamily: fonts.sans1, fontSize: 20, fontWeight: 'normal', color: 'rgb(0, 0, 0)', lineHeight: '100%'}
};

export function swapFonts(previousFont, newFont) {
    for(let key in TypeFaces) {
        let typeFace = TypeFaces[key];
        if(typeFace.fontFamily === previousFont) {
            typeFace.fontFamily = newFont;
        }
    }
}

export let UIBarTitle               = {properties: TypeFaces.UIBarTitle};
export let UIRegular                = {properties: TypeFaces.UIRegular};
export let UISmall                  = {properties: TypeFaces.UISmall};
export let UISmallGrey              = {properties: TypeFaces.UISmallGrey};
export let UITiny                   = {properties: TypeFaces.UITiny};
export let UITextualButtonPrimary   = {properties: TypeFaces.UITextualButtonPrimary};
export let UITextualButtonSecondary = {properties: TypeFaces.UITextualButtonSecondary};
export let TextBody                 = {properties: TypeFaces.TextBody};
export let TextH1                   = {properties: TypeFaces.TextH1};
export let TextH2                   = {properties: TypeFaces.TextH2};
export let TextH3                   = {properties: TypeFaces.TextH3};
export let TextCaptions             = {properties: TypeFaces.TextCaptions};
export let TextQuotes               = {properties: TypeFaces.TextQuotes};
export let TextLabel                = {properties: TypeFaces.TextLabel};
export let ImpactHuge               = {properties: TypeFaces.ImpactHuge};
export let ImpactBig                = {properties: TypeFaces.ImpactBig};



