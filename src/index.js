import commander from 'commander';
import chalk from 'chalk';
import { version } from '../package.json';
import hasYarn from './util/hasYarn';
import { TYPE } from './constants';
import run from './run';

const currentNodeVersion = process.versions.node;
const [major] = currentNodeVersion.split('.');

if (major < 4) {
    console.log(chalk.red(`您的Node.js版本为${currentNodeVersion}，\n` +
        '请运行`npm i -g n && sudo n latest`来升级Node.js！'));
    process.exit(1);
}

commander
    .version(version, '-v, --version')
    .name(chalk.bold('yqb-test-suite'))
    .description(chalk.green('Setup test suite，项目类型可以为 vue|react|RN|javascript，默认为javascript。'))
    .usage('[type]')
    // .option('-t, --type [value]', `项目类型，可以为 vue|react|RN|javascript，默认为javascript`, )
    .option('-m, --packageManager <command>', '使用特定的包管理器，默认优先级 yarn > npm')
    .option('--only-example', '仅更新测试用例的示例')
    .on('--help', () => {
        console.log();
        console.log('  Examples:');
        console.log();
        console.log('    $ yqb-test-suite vue');
        console.log('    $ yqb-test-suite react -m npm');
        console.log();
    })
    .parse(process.argv);commander
    .version(version, '-v, --version')
    .name(chalk.bold('yqb-test-suite'))
    .description(chalk.green('Setup test suite，项目类型可以为 vue|react|RN|javascript，默认为javascript。'))
    .usage('[type]')
    // .option('-t, --type [value]', `项目类型，可以为 vue|react|RN|javascript，默认为javascript`, )
    .option('-m, --packageManager <command>', '使用特定的包管理器，默认优先级 yarn > npm')
    .option('--only-example', '仅更新测试用例的示例')
    .on('--help', () => {
        console.log();
        console.log('  Examples:');
        console.log();
        console.log('    $ yqb-test-suite vue');
        console.log('    $ yqb-test-suite react -m npm');
        console.log();
    })
    .parse(process.argv);

let [type = 'javascript'] = commander.args;
if (/vue/i.test(type)) {
    type = TYPE.VUE;
}
else if (/rn|native/i.test(type)) {
    type = TYPE.RN;
}
else if (/react/i.test(type)) {
    type = TYPE.REACT;
}
else {
    type = TYPE.JAVASCRIPT;
}
let pkgManeger = commander.packageManager;
if (!pkgManeger) {
    pkgManeger = hasYarn ? 'yarn' : 'npm';
}

run(type, pkgManeger, commander.onlyExample);
