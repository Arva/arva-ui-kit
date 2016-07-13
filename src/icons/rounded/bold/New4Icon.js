import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/new4_rounded_bold.svg.txt!text';
        
        export class New4Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }