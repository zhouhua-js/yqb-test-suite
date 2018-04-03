import { logWithSpinner, stopSpinner } from './util/spinner';

export default async function run(type, pkgManager) {
    logWithSpinner('输出Jest配置文件');
    stopSpinner();
}
