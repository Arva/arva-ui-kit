import chai                                 from 'chai';
import {
    loadDependencies,
    mockDependency,
    mockArvaViewDependencies,
    restoreDOMGlobals}                      from '../../meta/TestBootstrap.js';

let should = chai.should();

describe('LinkedInLogin', () => {
    let imports = {};

    before(async function() {
        await mockArvaViewDependencies();
        mockDependency(System.normalizeSync('src/defaults/DefaultSettings.js'), ({
            Settings: {
                facebookBrowserModule: 'placeholder',
                facebookAppId: 'placeholder',
                moodleOrganisationID: 'placeholder',
                moodleRequestURI: 'placeholder',
                linkedInAuthServerUrl: 'placeholder',
                linkedInClientID: 'placeholder'
            }
        }));
        imports = await loadDependencies({
            LinkedInLogin: './src/utils/authentication/LinkedInLogin.js',
        });
    });

    after(() => {
        restoreDOMGlobals();
    });

    describe('#constructor', () => {
        it('constructs without exceptions', () => {
            let instance = new imports.LinkedInLogin();
            should.exist(instance);
        });
    });
});