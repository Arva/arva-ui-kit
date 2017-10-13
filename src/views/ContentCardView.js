/**
 * Created by lundfall on 20/10/2016.
 */

import {Colors}             from '../defaults/DefaultColors.js';

import Surface              from 'arva-js/famous/core/Surface.js';

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {limit}              from 'arva-js/utils/Limiter.js';

/* Horizontal margins are set later to center docked content */
@layout.dockPadding(16, 0)
@layout.flow()
export class ContentCardView extends View {

    _noColumns = 0;
    _cardWidth = 0;
    _cardsWithUncalculatedSize = [];

    _cards = [];

    /**
     * @example
     * new ContentCardView({
        cards: [
            new ImageTextButtonCard({shadow: 'hard', image: trolltunga}),
            new ImageTextButtonCard({title: "Hello world", subtitle: "This is a cool subtitle", body: "Finally, some body"}),
            new ImageTextButtonCard({subtitle: "subtitle"}),
            new ImageTextButtonCard({image: trolltunga, centerTitle: true, decorationalText: "This is some really decorated magical text. Look at it. LOOK!.", title: "Centered title", subtitle: "This is a cool subtitle", body: "Lorem ispum muchos gracias per favore vamos a la playa por favor, zeg maar heel goed.", buttons: ['Go back', 'Cancel']}),
            new ImageTextButtonCard({image: trolltunga, imageHeight: 200, body: "Lorem ispum", buttons: ['Button 1', 'Button 2']}),
            new ImageTextButtonCard({title: "Pretty title", decorationalText: "This is some decoration text ", button: 'This is a button'})
        ]}

     * @param {Array|Number} [options.spacing] A two-dimensional array setting the spacing between the items
     * @param {Number} [options.maxNoColumns] The maximum number of column that can be. Defaults to 3.
     * @param {Object} [options.background] The background options, or false if no background should be set
     * @param options
     */
    constructor(options = {}) {
        super(combineOptions({
            spacing: [16, 16],
            maxNoColumns: 3,
            cards: [],
            background: false,
            innerSpacing: 16
        }, options));
        for (let card of this.options.cards) {
            this.addCard(card);
        }

        if (this.options.background) {
            this.addRenderable(new Surface(options.background), 'background', layout.fullSize())
        }


        this.onNewSize(([width, height]) => {
            let innerWidth = (width - 16);
            let noColumns = limit(1, Math.floor(innerWidth / (288 + 16)), this.options.maxNoColumns);
            let cardWidth = limit(0, innerWidth / noColumns, 480) - this.options.innerSpacing;
            let {viewMargins} = this.decorations;
            viewMargins[1] = viewMargins[3] = (width - (noColumns * cardWidth + Math.max(this.options.spacing[1] * (noColumns - 1), 0) )) / 2;

            if (cardWidth === this._cardWidth && noColumns === this._noColumns) {
                return;
            }

            if (this._noColumns !== noColumns) {

                for (let i = 0; i < this._noColumns; i++) {
                    this.removeRenderable(this._getColumnName(i));
                }

                this._noColumns = noColumns;

                for (let i = 0; i < noColumns; i++) {
                    let column = new View();
                    this.addRenderable(column, this._getColumnName(i), layout.dock.left(), layout.size(cardWidth, ~300), layout.dockSpace(this.options.spacing[1]));
                }

                for (let card of this._cards) {
                    this._addCardToColumn(card);
                }
            } else if (this._cardWidth !== cardWidth) {
                for (let i = 0; i < this._noColumns; i++) {
                    this.decorateRenderable(this._getColumnName(i), layout.size(cardWidth, ~300));
                }
            }

            this._cardWidth = cardWidth;
        });
    }

    /**
     *
     * @param {Renderable} card
     * @returns {boolean} True if the adding of the card was successful
     */
    addCard(card) {
        this._cards.push(card);
        return this._addCardToColumn(card);
    }

    _addCardToColumn(card) {

        if (this._noColumns === 0) {
            /* Don't add the card yet, it will be added soon when the view resizes */
            return false;
        }

        /* If there is still some calculation that needs to happen, then wait for it */
        if (card.containsUncalculatedSurfaces() || !card._initialised) {
            if (!this._cardsWithUncalculatedSize.includes(card)) {
                /* Add the card to make it appear in the dom and calculate stuff */
                let cardIndex = this._cardsWithUncalculatedSize.length;
                this._cardsWithUncalculatedSize.push(card);
                this.addRenderable(card, this._getCardName(cardIndex), layout.opacity(0), layout.size(undefined, true));
            }

            card.once('recursiveReflow', this._addCardToColumn.bind(this, card));
            return false;
        }
        let cardSize = card.getSize();
        if (!cardSize[1]) {
            console.log("Error: Trying to insert a card without a size");
            return false;
        }


        /* If the card was already processing among the hidden renderable, we can now safely remove it */
        let indexOfUncalculatedCard = this._cardsWithUncalculatedSize.indexOf(card);
        if (~indexOfUncalculatedCard) {
            this.removeRenderable(this._getCardName(indexOfUncalculatedCard));
            this._cardsWithUncalculatedSize[indexOfUncalculatedCard] = {};
        }

        /* Get the column with the smallest height */
        let [suitableColumn] = this._getAllColumns().reduce(([minHeightColumn, minHeight], column) => {
            /* If size is undefined, then default to zero because that means that there is no content */
            let columnHeight = column.getSize()[1] || 0;
            return columnHeight < minHeight ? [column, columnHeight] : [minHeightColumn, minHeight];
        }, [null, Infinity]);

        /* Add the card here! */
        suitableColumn.addRenderable(card,
            this._getCardName(this._cards.indexOf(card)),
            layout.dock.top(~300),
            layout.dockSpace(this.options.spacing[0]),
            layout.opacity(1));
    }


    _getColumnName(index) {
        return `column${index}`;
    }

    _getCardName(index) {
        return `card${index}`;
    }

    _getAllColumns() {
        /* http://stackoverflow.com/questions/30650961/functional-way-to-iterate-over-range-es6-7 */
        return Array(this._noColumns).fill().map((_, i) => this[this._getColumnName(i)]);
    }


}