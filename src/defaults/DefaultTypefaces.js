/**
 * Created by tom on 23/06/16.
 */

import merge                    from 'lodash/merge.js';
import {Colors}                 from './DefaultColors.js'
import {Avenir}                 from '../fonts/Avenir.js';

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

export let TypeFaces = merge({
    UITitle: {fontSize: '18px', fontWeight: 'bold', get color() { return Colors.BasicTextColor; } , whiteSpace: 'nowrap'},
    UIRegular: {fontSize: '18px', fontWeight: 'normal', get color() { return Colors.BasicTextColor; } },
    UISmall: {fontSize: '14px', fontWeight: 'normal', get color() { return Colors.BasicTextColor; } },
    UISmallGrey: {fontSize: '14px', fontWeight: 'normal', get color() { return Colors.ModestTextColor; } },
    UITiny: {fontSize: '10px', fontWeight: 'normal', get color() { return Colors.BasicTextColor; } },
    UIButtonPrimary: {fontSize: '18px', fontWeight: 'bold', get color() { return Colors.PrimaryUIColor; } , whiteSpace: 'nowrap'},
    UIButtonPrimaryLight: {fontSize: '18px', fontWeight: 'normal', get color() { return Colors.PrimaryUIColor; } , whiteSpace: 'nowrap'},
    UIButtonSecondary: {fontSize: '18px', fontWeight: 'bold', get color() { return Colors.SecondaryUIColor; } , whiteSpace: 'nowrap'},
    UIButtonSecondaryLight: {fontSize: '18px', fontWeight: 'normal', get color() { return Colors.SecondaryUIColor; } , whiteSpace: 'nowrap'},

    TextBody: {fontSize: '18px', fontWeight: 'normal', get color() { return Colors.ArticleTextColor; } },
    TextH1: {fontSize: '64px', fontWeight: 'bold', get color() { return Colors.ArticleTextColor; }  },
    TextH2: {fontSize: '32px', fontWeight: 'bold', get color() { return Colors.ArticleTextColor; } },
    TextH3: {fontSize: '18px', fontWeight: 'bold', get color() { return Colors.ArticleTextColor; } },
    TextCaptions: {fontSize: '14px', fontWeight: 'normal', get color() { return Colors.ModestTextColor; } },
    TextQuote: {fontSize: '18px', fontWeight: 'bold', get color() { return Colors.ModestTextColor; } },
    TextQuoteEmphasis: {fontSize: '24px', fontWeight: 'normal', fontStyle: 'italic', get color() { return Colors.PrimaryUIColor; } },
    TextInfoLabel: {fontSize: '14px', fontWeight: 'normal', get color() { return Colors.ModestTextColor; } , textTransform: 'uppercase'},

    ImpactHuge: {fontSize: '64px', fontWeight: 'bold', get color() { return Colors.ImageTextColor; } },
    ImpactBig: {fontSize: '32px', fontWeight: 'bold', get color() { return Colors.ImageTextColor; } }
}, Avenir.UI, Avenir.Text, Avenir.Impact);

export function useTypefaces(...faces) {
    merge(TypeFaces, ...faces);
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
