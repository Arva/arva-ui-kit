import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/people_rounded_thin.txt';
        
        export class PeopleIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }