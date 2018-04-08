import chalk from 'chalk';
import path from 'path';
import { exec } from 'child_process';
import majo from 'majo';
import { render } from 'mustache';
import isBinaryPath from 'is-binary-path';
// import { logWithSpinner, stopSpinner, succeed } from './util/spinner';
import Spinner from './util/spinner';
import { DEP } from './constants';

function checkType(type) {
    return {
        [type]: true
    };
}

function absolutePath(p) {
    if (path.isAbsolute(p)) {
        return p;
    }
    return path.resolve(process.cwd(), p);
}

async function copy(source, dest, vars) {
    const stream = majo();
    source = absolutePath(source);
    dest = absolutePath(dest);
    return stream
        .source('**', { baseDir: source })
        .filter(file => !/\.DS_Store$/.test(file))
        .use(ctx => {
            ctx.fileList.forEach(file => {
                console.log(`    ${chalk.cyan(file)}`);
                const content = ctx.fileContents(file);
                if (!isBinaryPath(file)) {
                    ctx.writeContents(file, render(content, vars));
                }
            });
        })
        .dest(dest)
        .catch(console.error);
}

function configJest(type) {
    return copy(
        path.resolve(__dirname, '../template/base/'),
        process.cwd(),
        checkType(type)
    );
}

function copyExamples(type) {
    return copy(
        path.resolve(__dirname, '../template/examples/basic/'),
        path.resolve(process.cwd(), '__tests__/exsamles/'),
        checkType(type)
    ).then(() => copy(
        path.resolve(__dirname, `../template/examples/${type}/`),
        path.resolve(process.cwd(), '__tests__/exsamles/'),
        checkType(type)
    ));
}

function install(pkg, pkgManager) {
    let cmd;
    if (pkgManager === 'yarn') {
        cmd = `yarn add ${pkg}`;
    }
    else {
        cmd = `${pkgManager} i ${pkg}`;
    }
    return new Promise((resolve, reject) => {
        const child = exec(cmd, { stdio: 'ignore' });
        child.on('close', code => {
            if (code) {
                reject();
            }
            else {
                resolve();
            }
        });
    });
}

function installDeps(type, pkgManager) {
    return new Promise((resolve, reject) => {
        const depList = [...DEP.basic, ...(DEP[type] || [])];
        function innerRun() {
            if (depList.length) {
                const pkg = depList.shift();
                const installStatus = new Spinner({
                    indent: 4,
                    text: pkg,
                    type: 'growHorizontal'
                });
                install(pkg, pkgManager)
                    .then(() => installStatus.success({ symbol: chalk.green('+') }))
                    .then(innerRun)
                    .catch(reject);
            }
            else {
                resolve();
            }
        }
        innerRun();
    });
}

function addNpmScript() {
    // logWithSpinner('addNpmScript');
}

export default async function run(type, pkgManager) {
    let spinner = new Spinner('输出Jest配置文件');
    await configJest(type);
    spinner.success();
    console.log();

    spinner = new Spinner('输出单测示例: __tests__/examples/');
    await copyExamples(type);
    spinner.success();
    console.log();

    spinner = new Spinner('安装依赖');
    await installDeps(type, pkgManager);
    spinner.success();
    console.log();

    spinner = new Spinner('添加npm命令');
    addNpmScript();
    spinner.success();
}
