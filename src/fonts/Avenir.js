/**
 * Created by tom on 23/06/16.
 */

import './resources/avenir-book.css!';
import './resources/avenir-heavy.css!'

let avenirBook = 'avenir-book';
let avenirHeavy = 'avenir-heavy';
export default avenirBook;

export let Avenir = {
    UI: {
        UITitle: {fontFamily: avenirBook, lineHeight: '1.0'},
        UITHeader: {fontFamily: avenirBook, lineHeight: '1.0', fontSize: '32px'},
        UIRegular: {fontFamily: avenirBook, lineHeight: '1.0'},
        UISmall: {fontFamily: avenirBook, lineHeight: '1.0'},
        UISmallGray: {fontFamily: avenirBook, lineHeight: '1.0'},
        UITiny: {fontFamily: avenirBook, lineHeight: '1.0'},
        UIButtonPrimary: {fontFamily: avenirHeavy, lineHeight: '1.0'},
        UIButtonPrimaryLight: {fontFamily: avenirBook, lineHeight: '1.0'},
        UIButtonSecondary: {fontFamily: avenirBook, lineHeight: '1.0'},
        UIButtonSecondaryLight: {fontFamily: avenirBook, lineHeight: '1.0'}
    },

    Text: {
        TextBody: {fontFamily: avenirBook, lineHeight: '1.4'},
        TextH1: {fontFamily: avenirBook, lineHeight: '0.9'},
        TextH2: {fontFamily: avenirBook, lineHeight: '0.9'},
        TextH3: {fontFamily: avenirBook, lineHeight: '1.2'},
        TextCaption: {fontFamily: avenirBook, lineHeight: '0.9'},
        TextQuote: {fontFamily: avenirBook, lineHeight: '1.2'},
        TextQuoteEmphasis: {fontFamily: avenirBook, lineHeight: '1.2'},
        TextInfoLabel: {fontFamily: avenirBook, textTransform: 'uppercase', lineHeight: '0.9'}
    }

};