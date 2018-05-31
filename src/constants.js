import Enum from 'easy-enum.js';

export const TYPE = new Enum({
    JAVASCRIPT: 'javascript',
    RN: 'rn',
    VUE: 'vue',
    REACT: 'react'
});

export const DEP = {
    basic: ['jest', 'babel-jest', 'chai', 'sinon', 'sinon-chai', 'chai-as-promised', 'power-assert', 'babel-preset-power-assert'],
    vue: ['@vue/test-utils', 'vue-jest'],
    react: ['enzyme', 'chai-enzyme@beta'],
    rn: ['enzyme', 'chai-enzyme']
};
