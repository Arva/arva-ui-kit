import chai                                 from 'chai';
import {
    loadDependencies,
    mockDependency,
    mockArvaViewDependencies,
    restoreDOMGlobals}                      from '../../meta/TestBootstrap.js';

let should = chai.should();

describe('FacebookLogin', () => {
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
            FacebookLogin: './src/utils/authentication/FacebookLogin.js',
        });
    });

    after(() => {
        restoreDOMGlobals();
    });

    describe('#constructor', () => {
        it('constructs without exceptions', () => {
            let instance = new imports.FacebookLogin();
            should.exist(instance);
        });
    });
});