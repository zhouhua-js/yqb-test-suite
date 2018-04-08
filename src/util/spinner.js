import DraftLog from 'draftlog';
import chalk from 'chalk';
import isString from 'lodash/isString';
import includes from 'lodash/includes';
import pad from 'lodash/padEnd';
import symbols from 'log-symbols';

import spinners from './spinners.json';

DraftLog(console);

export default class Spinner {
    constructor(msg) {
        this.spinning = false;
        this.init();
        msg && this.start(msg);
    }
    init() {
        // info、success、warning、error
        Object.keys(symbols).forEach(key => {
            this[key] = (msg = {}) => {
                this.spinning = false;
                this.pause();
                if (isString(msg)) {
                    this.text = msg;
                    this.symbol = symbols[key];
                }
                else {
                    if (msg.text) {
                        this.text = msg.text;
                    }
                    this.symbol = msg.symbol || symbols[key];
                }
                this.update();
            };
        });
        this.draft = console.draft();
    }
    logger(text) {
        this.indent = this.indent || 0;
        this.draft(`${pad('', this.indent)}${text}`);
    }
    log(msg = '') {
        if (isString(msg)) {
            this.text = msg;
        }
        else {
            this.symbol = msg.symbol;
            this.symbolColor = msg.symbolColor;
            this.text = msg.text;
        }
        this.update();
    }
    pause() {
        if (this.clock) {
            clearInterval(this.clock);
        }
    }
    resume() {
        this.spinning = true;
        this.clock = setInterval(this.update, this.spinner.interval);
    }
    update() {
        if (this.spinning) {
            if (!includes(['black', 'red', 'green', 'yellow', 'blue', 'magenta',
                'cyan', 'white', 'gray'], this.color)) {
                this.color = 'cyan';
            }
            const spinnerText = this.spinner.frames[this.frameIndex];
            this.logger(`${chalk[this.color](spinnerText)}  ${this.text}`);
            this.frameIndex = (this.frameIndex + 1) % this.spinner.frames.length;
        }
        else if (this.symbol) {
            this.logger(`${this.symbol}  ${this.text}`);
        }
        else {
            this.logger(this.text);
        }
    }
    start(msg = {}) {
        if (isString(msg)) {
            this.text = msg;
        }
        else {
            if (msg.type) {
                this.spinnerType = msg.type;
            }
            if (msg.text) {
                this.text = msg.text;
            }
            if (msg.indent) {
                this.indent = msg.indent;
            }
        }
        this.spinner = spinners[this.spinnerType || ''];
        if (!this.spinner) {
            this.spinner = spinners.dots;
        }
        this.spinning = true;
        this.pause();
        this.frameIndex = 0;
        this.update();
        this.clock = setInterval(this.update.bind(this), this.spinner.interval);
    }
}
