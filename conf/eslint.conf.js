const prettierConfig = require('./prettier.conf');

// JSDoc rule들을 적용할 부분들.
const jsdocContexts = [
    'FunctionDeclaration',
    'MethodDefinition',
    'ClassDeclaration',
    'FunctionExpression',

    // TypeScript interface 및 type alias.
    'TSInterfaceDeclaration',
    'TSTypeAliasDeclaration',
];

// https://github.com/airbnb/javascript/blob/cbf9ade/packages/eslint-config-airbnb-base/rules/style.js#L333
const airbnbRestrictedSyntax = {
    forIn: {
        selector: 'ForInStatement',
        message:
            'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
    },
    // for...of 허용.
    forOf: {
        selector: 'ForOfStatement',
        message:
            'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
    },
    label: {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
    },
    with: {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
    },
};

module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'jsdoc'],
    extends: [
        // Airbnb style guide 적용.
        'airbnb',
        'airbnb/hooks',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:jsdoc/recommended',
    ],
    ignorePatterns: ['node_modules/', 'src/module', 'src/**/*.css.d.ts', 'src/**/*.scss.d.ts'],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
                moduleDirectory: ['node_modules', 'src/', 'src/module/'],
            },
        },
    },
    rules: {
        'jsdoc/require-jsdoc': [
            'error',
            {
                publicOnly: false,
                require: {
                    FunctionDeclaration: true,
                    MethodDefinition: true,
                    ClassDeclaration: true,
                    FunctionExpression: true,
                    // { foo: () => { ... } }와 같이 익명 함수를 만들어 쓰는 경우 때문에 끔.
                    ArrowFunctionExpression: false,
                },
                contexts: jsdocContexts,
            },
        ],
        // jsdoc: 함수 설명 필수.
        'jsdoc/require-description': ['error', { contexts: jsdocContexts }],
        // jsdoc: 리턴값 필요 X.
        'jsdoc/require-returns': 'off',
        'jsdoc/require-returns-type': 'off',
        // jsdoc: 함수 인수 필요 X, but 인수를 적었으면 인수 설명은 무조건 적어야 함.
        'jsdoc/require-param': 'off',
        'jsdoc/require-param-type': 'off',
        'jsdoc/require-param-description': ['error', { contexts: jsdocContexts }],
        'jsdoc/check-param-names': 'off',
        'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
        // dependencies 무시.
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: true,
            },
        ],
        // Component attribute에 {} 맘대로 써도 됨.
        'react/jsx-curly-brace-presence': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'prettier/prettier': ['error', prettierConfig],
        // Import할 때 확장자 무조건 쓰라는 것 off.
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
        // Class 내부에서 this 접근 안 하는 non-static method 허용.
        'class-methods-use-this': 'off',
        // React 사용시 정의 안 되어 있다는 에러 나는거 수정. (https://stackoverflow.com/a/64024916/2804329)
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        // 함수 자료형 항상 명시하는 것 off.
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        // 예전 방식의 default props 사용법 강제 off (https://github.com/yannickcr/eslint-plugin-react/issues/1433)
        'react/require-default-props': 'off',
        // MobX action을 정의할 때 parameter의 속성을 수정하는 것 때문에 오류나는 것 off.
        // (https://stackoverflow.com/questions/35637770/how-to-avoid-no-param-reassign-when-setting-a-property-on-a-dom-object)
        'no-param-reassign': ['error', { props: false }],
        // ESLint가 TypeScript Enum을 제대로 인식하지 못하고 'already declared' 에러 때리는 버그 수정.
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        // onClick이 있으면 onKeyDown 등도 있어야 한다는 에러 off.
        'jsx-a11y/click-events-have-key-events': 'off',
        // File 별 class 갯수 제한 설정
        'max-classes-per-file': ['error', 10],
        // <input/> + <label/> 사용 시 label 안에 input을 넣거나 id로 둘이 연결하는 것 중 하나만 하면 되도록 함.
        // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-associated-control.md
        'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
        // Widget Component가 click을 받기 위함.
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        // Video component에 caption(자막)이 없어도 동작하도록 함
        'jsx-a11y/media-has-caption': 'off',
        // type 추론 되면 type명시 안하도록 하는 것
        '@typescript-eslint/no-inferrable-types': 'off',
        // for loop 의 ++, -- 등을 허용
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        // else 문 내에서 다시 if, else가 나오는 것을 허용
        'no-lonely-if': 'off',
        'no-restricted-syntax': [
            'error',
            airbnbRestrictedSyntax.forIn,
            // for...of 허용.
            // airbnbRestrictedSyntax.forOf,
            airbnbRestrictedSyntax.label,
            airbnbRestrictedSyntax.with,
        ],
        // 존재하는데 인식하지 못하는 prop
        'react/no-unknown-property': ['error', { ignore: ['intensity', 'css'] }],
    },
};
