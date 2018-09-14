/**
 * Created by syj on 2018/4/2.
 */
const tsc = require('typescript');
const babelJest = require('babel-jest');

const res = tsc.readConfigFile("../tsconfig.json")
module.exports = {
    process(src, path) {
        const isTs = path.endsWith('.ts');
        const isTsx = path.endsWith('.tsx');
        console.log(`process module ${path} `);
        if (isTs || isTsx) {
            src = tsc.transpileModule(
                src,
                Object.assign({}, res.config, {
                    fileName: path,
                    reportDiagnostics: true
                })
            );
            src = src.outputText;
            // update the path so babel can try and process the output
            path = path.substr(0, path.lastIndexOf('.')) + (isTs ? '.js' : '.jsx') || path;
        }
        if (path.endsWith('.js') || path.endsWith('.jsx')) {
            src = babelJest.process(src, path);
        }
        return src;
    }
};
