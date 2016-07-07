import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/new3_rounded_thin.txt';
        
        export class New3Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }