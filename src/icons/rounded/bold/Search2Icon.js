import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/search2_rounded_bold.txt';
        
        export class Search2Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }