/**
 * Created by tom on 23/10/15.
 */

import System                   from 'systemjs';
import sinon                    from 'sinon';
import '../../config.js';
import requestAnimationFrame        from 'request-animation-frame-mock';

let onSystemReady = System.import('./test/meta/DummyFile.js');

export function mockDependency(dependency, replacement) {

    if (!replacement) {
        replacement = sinon.stub();
    }
    if (typeof replacement === 'function') {
        replacement = {default: replacement};
    }

    System.delete(System.normalizeSync(dependency));
    System.set(System.normalizeSync(dependency), System.newModule(replacement));
}

export async function mockArvaViewDependencies() {
    mockDependency('famous/surfaces/ImageSurface.js');
    mockDependency('famous/surfaces/ContainerSurface.js', () => ({add: () => {}}));
    mockDependency('famous/core/Context.js', () => ({add: () => {}}) );
    mockDependency('css', {fetch: () => 'export default "";'});

    await mockDOMGlobals();
    let ElementOutput = await System.import('famous/core/ElementOutput');
    let Decorators = await System.import('arva-js/layout/Decorators.js');
    Decorators.layout.margins = () => (() => {});

    //Mock for the Famous Surface
    mockDependency('./ElementOutput.js', ElementOutput);
    mockDependency('famous/core/Group.js');
    mockDependency('famous/utilities/Timer.js');
    mockDependency('arva-js/layout/Decorators.js', Decorators);
    mockDependency('arva-js/utils/Injection.js', { Injection: { get: (something) => new something() } });
    mockDependency('famous-flex/LayoutUtility.js', { registerHelper: () => {} });
    mockDependency('famous-flex/FlexScrollView.js', () => ({ options: {} }));
    mockDependency('famous-flex/ScrollController.js', () => ({ pipe: () => {} }));
}

export function restoreDependency(dependency) {
    System.delete(System.normalizeSync(dependency));
}

export async function mockDOMGlobals() {
    await onSystemReady;
    if (global) {
        global['history'] = [];
        history.pushState = function(){
            window.location.hash  = Array.from(arguments).splice(-1)[0];
        };
        global['document'] = {
            addEventListener: () => {},
            documentElement: {style: {}},
            createElement: sinon.stub().returns({
                style: {},
                addEventListener: new Function(),
                classList: {add: sinon.stub()}
            }),
            createDocumentFragment: sinon.stub().returns({
                appendChild: sinon.stub()
            })
        };
        global['window'] = {
            requestAnimationFrame: requestAnimationFrame.mock.requestAnimationFrame,
            addEventListener: new Function(),
            location: {hash: ''}
        };
        global['Node'] = sinon.stub();
    }
    else {
        window['Node'] = sinon.stub();
    }
}


export function restoreDOMGlobals() {
    if (global && (global['window'] || global['document'])) {
        delete global['document'];
        delete global['window'];
        delete global['history'];
        delete global['Node'];
    }

}


export function loadDependencies(dependencies) {
    let imports = {};
    let promises = [];

    for (let key in dependencies) {
        let dependencyLocation = dependencies[key];
        promises.push(System.import(dependencyLocation).then((importedObject) => {
            imports[key] = importedObject[key] || importedObject.default || importedObject;
        }));
    }

    return Promise.all(promises).then(() => {
        return imports;
    });
}