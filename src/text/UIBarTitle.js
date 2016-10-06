/**
 * Created by vlad on 06/10/2016.
 */

import {UITitle}            from './UITitle.js';

export class UIBarTitle extends UITitle {

    static getColor(variation = 'white') {
        switch (variation) {
            default:
                console.log('Invalid variation selected. Falling back to default settings (white).');
            case 'white':
                return 'rgb(0, 0, 0)';
            case 'colored':
                return 'rgba(255, 255, 255, 0.7)';
        }
    }

    setVariation(variation) {
        this.setProperties({color: UIBarTitle.getColor(variation)});
    }

}