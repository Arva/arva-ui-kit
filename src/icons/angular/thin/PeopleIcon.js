import {BaseIcon}                  from '../../BaseIcon.js';
        import iconImage                   from '../../resources/people_angular_thin.svg.txt!text';
        
        export class PeopleIcon extends BaseIcon {
            constructor(options){
                super({...options, iconPath: iconImage});
            }
        }