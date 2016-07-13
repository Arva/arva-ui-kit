import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/new2_angular_thin.svg.txt!text';
        
        export class New2Icon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }