/**
 * Created by tom on 23/06/16.
 */

import _                        from 'lodash';
import Avenir                   from '../fonts/Avenir.js';
import {Colors}                 from './DefaultColors.js'

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
    UITitle: {fontSize: 18, fontWeight: 'bold', color: Colors.BasicTextColor},
    UIRegular: {fontSize: 18, fontWeight: 'normal', color: Colors.BasicTextColor},
    UISmall: {fontSize: 14, fontWeight: 'normal', color: Colors.BasicTextColor},
    UISmallGrey: {fontSize: 14, fontWeight: 'normal', color: Colors.ModestTextColor},
    UITiny: {fontSize: 10, fontWeight: 'normal', color: Colors.BasicTextColor},
    UIButtonPrimary: {fontSize: 18, fontWeight: 'bold', color: Colors.PrimaryUIColor, whiteSpace: 'nowrap'},
    UIButtonPrimaryLight: {fontSize: 18, fontWeight: 'normal', color: Colors.PrimaryUIColor},
    UIButtonSecondary: {fontSize: 18, fontWeight: 'bold', color: Colors.SecondaryUIColor},
    UIButtonSecondaryLight: {fontSize: 18, fontWeight: 'normal', color: Colors.SecondaryUIColor},

    TextBody: {fontSize: 18, fontWeight: 'normal', color: Colors.ArticleTextColor},
    TextH1: {fontSize: 64, fontWeight: 'bold', color: Colors.ArticleTextColor },
    TextH2: {fontSize: 32, fontWeight: 'bold', color: Colors.ArticleTextColor},
    TextH3: {fontSize: 18, fontWeight: 'bold', color: Colors.ArticleTextColor},
    TextCaptions: {fontSize: 14, fontWeight: 'normal', color: Colors.ModestTextColor},
    TextQuote: {fontSize: 18, fontWeight: 'bold', color: Colors.ModestTextColor},
    TextQuoteEmphasis: {fontSize: 24, fontWeight: 'normal', fontStyle: 'italic', color: Colors.PrimaryUIColor},
    TextInfoLabel: {fontSize: 14, fontWeight: 'normal', color: Colors.ModestTextColor, textTransform: 'uppercase'},

    ImpactHuge: {fontSize: 64, fontWeight: 'bold', color: Colors.ImageTextColor},
    ImpactBig: {fontSize: 32, fontWeight: 'bold', color: Colors.ImageTextColor}
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



