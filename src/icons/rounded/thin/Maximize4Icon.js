import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/maximize4_rounded_thin.txt';
        
        export class Maximize4Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }