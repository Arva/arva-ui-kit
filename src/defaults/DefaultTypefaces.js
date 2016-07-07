/**
 * Created by tom on 23/06/16.
 */

import _                        from 'lodash';
import Avenir                   from '../fonts/Avenir.js';

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

export let TypeFaces = _.merge({
    UITitle: {fontSize: 18, fontWeight: 'bold', color: 'rgb(0, 0, 0)'},
    UIRegular: {fontSize: 18, fontWeight: 'normal', color: 'rgb(0, 0, 0)'},
    UISmall: {fontSize: 14, fontWeight: 'normal', color: 'rgb(0, 0, 0)'},
    UISmallGrey: {fontSize: 14, fontWeight: 'normal', color: 'rgb(170, 170, 170)'},
    UITiny: {fontSize: 10, fontWeight: 'normal', color: 'rgb(0, 0, 0)'},
    UIButtonPrimary: {fontSize: 18, fontWeight: 'bold', color: 'rgb(0, 0, 0)'},
    UIButtonPrimaryLight: {fontSize: 18, fontWeight: 'normal', color: 'rgb(0, 0, 0)'},
    UIButtonSecondary: {fontSize: 18, fontWeight: 'bold', color: 'rgb(0, 0, 0)'},
    UIButtonSecondaryLight: {fontSize: 18, fontWeight: 'normal', color: 'rgb(0, 0, 0)'},

    TextBody: {fontSize: 18, fontWeight: 'normal', color: 'rgb(20, 20, 20)'},
    TextH1: {fontSize: 64, fontWeight: 'bold', color: 'rgb(20, 20, 20)' },
    TextH2: {fontSize: 32, fontWeight: 'bold', color: 'rgb(20, 20, 20)'},
    TextH3: {fontSize: 18, fontWeight: 'bold', color: 'rgb(20, 20, 20)'},
    TextCaptions: {fontSize: 14, fontWeight: 'normal', color: 'rgb(170, 170, 170)'},
    TextQuote: {fontSize: 18, fontWeight: 'bold', color: 'rgb(170, 170, 170)'},
    TextQuoteEmphasis: {fontSize: 24, fontWeight: 'normal', fontStyle: 'italic', color: 'rgb(170, 170, 170)'},
    TextInfoLabel: {fontSize: 14, fontWeight: 'normal', color: 'rgb(170, 170, 170)', textTransform: 'uppercase'},

    ImpactHuge: {fontSize: 64, fontWeight: 'bold', color: 'rgb(255, 255, 255)'},
    ImpactBig: {fontSize: 32, fontWeight: 'bold', color: 'rgb(255, 255, 255)'}
}, Avenir.UI, Avenir.Text, Avenir.Impact);

export function useTypefaces(...faces) {
    _.merge(TypeFaces, ...faces);
}

export let UITitle                  = {properties: TypeFaces.UITitle};
export let UIRegular                = {properties: TypeFaces.UIRegular};
export let UISmall                  = {properties: TypeFaces.UISmall};
export let UISmallGrey              = {properties: TypeFaces.UISmallGrey};
export let UITiny                   = {properties: TypeFaces.UITiny};
export let UIButtonPrimary          = {properties: TypeFaces.UIButtonPrimary};
export let UIButtonPrimaryLight     = {properties: TypeFaces.UIButtonPrimaryLight};
export let UIButtonSecondary        = {properties: TypeFaces.UIButtonSecondary};
export let UIButtonSecondaryLight   = {properties: TypeFaces.UIButtonSecondaryLight};
export let TextBody                 = {properties: TypeFaces.TextBody};
export let TextH1                   = {properties: TypeFaces.TextH1};
export let TextH2                   = {properties: TypeFaces.TextH2};
export let TextH3                   = {properties: TypeFaces.TextH3};
export let TextCaptions             = {properties: TypeFaces.TextCaptions};
export let TextQuote                = {properties: TypeFaces.TextQuote};
export let TextInfoLabel            = {properties: TypeFaces.TextInfoLabel};
export let ImpactHuge               = {properties: TypeFaces.ImpactHuge};
export let ImpactBig                = {properties: TypeFaces.ImpactBig};



