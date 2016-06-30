import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/new4_rounded_thin.svg';
        
        export class New4Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }