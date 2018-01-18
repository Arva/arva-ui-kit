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
// - [ ] UI small gray (reduced visual weight for less important stuff)
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
// - [ ] Date&time/location/person label (gray caps)
//
// TYPEFACES IMPACT (huge centered titles, over header images etc)
// Fonts that will be used: Futura, Gill Sans
// - [ ] Huge
// - [ ] Big

export let TypeFaces = merge({
    UIHeader: {fontSize: "32px", fontWeight: 'bold', get color(){ return Colors.BasicTextColor; }, whiteSpace: 'nowrap'},
    UITitle: {fontSize: '18px', fontWeight: 'bold', get color() { return Colors.BasicTextColor; } , whiteSpace: 'nowrap'},
    UIRegular: {fontSize: '18px', fontWeight: 'normal', get color() { return Colors.BasicTextColor; } },
    UIRegularGray: {fontSize: '18px', fontWeight: 'normal', get color() { return Colors.ModestTextColor; } },
    UISmall: {fontSize: '14px', fontWeight: 'normal', get color() { return Colors.BasicTextColor; } },
    UISmallGray: {fontSize: '14px', fontWeight: 'normal', get color() { return Colors.ModestTextColor; } },
    UITiny: {fontSize: '10px', fontWeight: 'normal', get color() { return Colors.BasicTextColor; } },
    UIButtonPrimary: {fontSize: '18px', fontWeight: 'bold', get color() { return Colors.PrimaryUIColor; } , whiteSpace: 'nowrap'},
    UIButtonPrimaryLight: {fontSize: '18px', fontWeight: 'normal', get color() { return Colors.PrimaryUIColor; } , whiteSpace: 'nowrap'},
    UIButtonSecondary: {fontSize: '18px', fontWeight: 'bold', get color() { return Colors.SecondaryUIColor; } , whiteSpace: 'nowrap'},
    UIButtonSecondaryLight: {fontSize: '18px', fontWeight: 'normal', get color() { return Colors.SecondaryUIColor; } , whiteSpace: 'nowrap'},

    TextBody: {fontSize: '18px', fontWeight: 'normal', get color() { return Colors.ArticleTextColor; } },
    TextH1: {fontSize: '64px', fontWeight: 'bold', get color() { return Colors.ArticleTextColor; }  },
    TextH2: {fontSize: '32px', fontWeight: 'bold', get color() { return Colors.ArticleTextColor; } },
    TextH3: {fontSize: '18px', fontWeight: 'bold', get color() { return Colors.ArticleTextColor; } },
    TextCaption: {fontSize: '14px', fontWeight: 'normal', get color() { return Colors.ModestTextColor; } },
    TextQuote: {fontSize: '24px', fontWeight: 'normal', fontStyle: 'italic', get color() { return Colors.PrimaryUIColor; } },
    TextInfoLabel: {fontSize: '14px', fontWeight: 'normal', get color() { return Colors.ModestTextColor; } , textTransform: 'uppercase'},

}, Avenir.UI, Avenir.Text, Avenir.Impact);

export function useTypefaces() {
    console.log('Warning: DefaultTypeFaces.js:useTypefaces() has been deprecated in favor of setTypefaces()');
    return setTypefaces(...arguments);
}

export function setTypefaces(...faces){
    merge(TypeFaces, ...faces);
}

export let UIHeader                 = {properties: TypeFaces.UIHeader};
export let UITitle                  = {properties: TypeFaces.UITitle};
export let UIRegular                = {properties: TypeFaces.UIRegular};
export let UIRegularGray = {properties: TypeFaces.UIRegularGray};
export let UISmall                  = {properties: TypeFaces.UISmall};
export let UISmallGray              = {properties: TypeFaces.UISmallGray};
export let UITiny                   = {properties: TypeFaces.UITiny};
export let UIButtonPrimary          = {properties: TypeFaces.UIButtonPrimary};
export let UIButtonPrimaryLight     = {properties: TypeFaces.UIButtonPrimaryLight};
export let UIButtonSecondary        = {properties: TypeFaces.UIButtonSecondary};
export let UIButtonSecondaryLight   = {properties: TypeFaces.UIButtonSecondaryLight};
export let TextBody                 = {properties: TypeFaces.TextBody};
export let TextH1                   = {properties: TypeFaces.TextH1};
export let TextH2                   = {properties: TypeFaces.TextH2};
export let TextH3                   = {properties: TypeFaces.TextH3};
export let TextCaption              = {properties: TypeFaces.TextCaption};
export let TextQuote                = {properties: TypeFaces.TextQuote};
export let TextQuoteEmphasis        = {properties: TypeFaces.TextQuoteEmphasis};
export let TextInfoLabel            = {properties: TypeFaces.TextInfoLabel};
