import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/new4_rounded_thin.txt';
        
        export class New4Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }