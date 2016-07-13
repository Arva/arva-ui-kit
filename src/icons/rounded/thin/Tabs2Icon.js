import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/tabs2_rounded_thin.svg.txt!text';
        
        export class Tabs2Icon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }