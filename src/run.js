import chalk from 'chalk';
import path from 'path';
import sh from 'shelljs';
import copy from 'fancy-copy';
import { exec } from 'child_process';
import writePkg from 'write-pkg';
import readPkg from 'read-pkg';
import Spinner from 'draft-spinner';
import { DEP } from './constants';

function checkType(type) {
    return {
        [type]: true
    };
}

function logFileName(file) {
    console.log(`    ${chalk.cyan(file)}`);
}

function afterTransform(files) {
    Object.keys(files).forEach(logFileName);
}

function configJest(type) {
    return copy(
        path.resolve(__dirname, '../template/base/'),
        process.cwd(),
        checkType(type),
        {
            afterTransform
        }
    );
}

function copyExamples(type) {
    return copy(
        path.resolve(__dirname, '../template/examples/basic/'),
        path.resolve(process.cwd(), '__tests__/exsamles/'),
        checkType(type),
        {
            afterTransform
        }
    ).then(() => copy(
        path.resolve(__dirname, `../template/examples/${type}/`),
        path.resolve(process.cwd(), '__tests__/exsamles/'),
        checkType(type),
        {
            afterTransform
        }
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
    return readPkg(process.cwd())
        .then(data => {
            const res = { scripts: {}, ...data };
            res.scripts.test = 'jest --no-cache';
            return writePkg(process.cwd(), res);
        })
        .then(() => {
            sh.ShellString('\ncoverage\n').toEnd(path.resolve(process.cwd(), '.gitignore'));
        });
}

export default async function run(type, pkgManager, onlyExample) {
    let spinner;
    try {
        if (!onlyExample) {
            spinner = new Spinner('输出Jest配置文件');
            await configJest(type);
            spinner.success();
            console.log();

            spinner = new Spinner('安装依赖');
            await installDeps(type, pkgManager);
            spinner.success();
            console.log();

            spinner = new Spinner('添加npm命令，修改.gitignore');
            await addNpmScript();
            spinner.success();
            console.log();
        }
        spinner = new Spinner('输出单测示例: __tests__/examples/');
        await copyExamples(type);
        spinner.success();
        console.log();
    }
    catch (e) {
        spinner.error();
        console.error(e);
        process.exit(-1);
    }

    console.log();
    console.log(chalk.greenBright.bold('测试环境配置完成，运行') +
        chalk.cyan('`npm run test`') +
        chalk.greenBright.bold('开始单元测试'));
    console.log(`您可以在 ${chalk.cyan('./coverage/')} 目录下查看覆盖率报告`);
    console.log();
    console.log();
    console.log('还有以下操作需要您手动完成：');
    console.log();
    console.log(`${chalk.dim('◻︎ (optional)')} 配置babel`);
    console.log(`  在.bablerc中添加 ${chalk.cyan.bold('power-assert')} 这个preset，以获得更佳的assert断言支持`);
    console.log();
    console.log(`${chalk.dim('◻︎ (optional)')} 配置eslint`);
    console.log(`  在.eslintrc中添加${chalk.cyan.bold('globals')}字段：`);
    console.log(chalk`    {cyan "globals"}: \{
        {cyan "test"}: {magenta true},
        {cyan "it"}: {magenta true},
        {cyan "describe"}: {magenta true},
        {cyan "expect"}: {magenta true},
        {cyan "assert"}: {magenta true},
        {cyan "shallow"}: {magenta true},
        {cyan "mount"}: {magenta true},
        {cyan "render"}: {magenta true},
        {cyan "renderToString"}: {magenta true}
    \}`);
    console.log();
}
