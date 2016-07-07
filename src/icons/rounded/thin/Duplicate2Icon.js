import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/duplicate2_rounded_thin.txt';
        
        export class Duplicate2Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }