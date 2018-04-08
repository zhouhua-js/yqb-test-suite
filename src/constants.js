import Enum from 'easy-enum.js';

export const TYPE = new Enum({
    JAVASCRIPT: 'javascript',
    RN: 'rn',
    VUE: 'vue',
    REACT: 'react'
});

export const DEP = {
    basic: ['jest', 'babel-jest', 'chai', 'sinon', 'chai-sinon', 'chai-as-promised', 'power-assert', 'babel-preset-power-assert'],
    vue: ['@vue/test-utils', 'vue-jest'],
    react: ['enzyme', 'chai-enzyme'],
    rn: ['enzyme', 'chai-enzyme', 'react-native-mock']
};
