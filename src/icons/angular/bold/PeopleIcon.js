import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/people_angular_bold.txt';
        
        export class PeopleIcon extends BaseIcon {
            constructor(options){
                super({...options, icon: iconImage});
            }
        }