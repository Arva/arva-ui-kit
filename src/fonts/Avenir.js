/**
 * Created by tom on 23/06/16.
 */

import './resources/avenir-book.css!';

let avenirStyle = 'avenir-book';
export default avenirStyle;

export let Avenir = {
    UI: {
        UITitle: {fontFamily: avenirStyle, lineHeight: '1.0'},
        UIRegular: {fontFamily: avenirStyle, lineHeight: '1.0'},
        UISmall: {fontFamily: avenirStyle, lineHeight: '1.0'},
        UISmallGray: {fontFamily: avenirStyle, lineHeight: '1.0'},
        UITiny: {fontFamily: avenirStyle, lineHeight: '1.0'},
        UIButtonPrimary: {fontFamily: avenirStyle, lineHeight: '1.0'},
        UIButtonPrimaryLight: {fontFamily: avenirStyle, lineHeight: '1.0'},
        UIButtonSecondary: {fontFamily: avenirStyle, lineHeight: '1.0'},
        UIButtonSecondaryLight: {fontFamily: avenirStyle, lineHeight: '1.0'}
    },

    Text: {
        TextBody: {fontFamily: avenirStyle, lineHeight: '1.4'},
        TextH1: {fontFamily: avenirStyle, lineHeight: '0.9'},
        TextH2: {fontFamily: avenirStyle, lineHeight: '0.9'},
        TextH3: {fontFamily: avenirStyle, lineHeight: '1.2'},
        TextCaption: {fontFamily: avenirStyle, lineHeight: '0.9'},
        TextQuote: {fontFamily: avenirStyle, lineHeight: '1.2'},
        TextQuoteEmphasis: {fontFamily: avenirStyle, lineHeight: '1.2'},
        TextInfoLabel: {fontFamily: avenirStyle, textTransform: 'uppercase', lineHeight: '0.9'}
    },

    Impact: {
        ImpactHuge: {fontFamily: avenirStyle, lineHeight: '1.0'},
        ImpactBig: {fontFamily: avenirStyle, lineHeight: '1.0'}
    }
    
};