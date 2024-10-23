module.exports = {
    // " 대신 ' 사용.
    singleQuote: true,
    // 코드 마지막에 semicolon 사용.
    semi: true,
    // 탭 대신 스페이스 사용.
    useTabs: false,
    // 들여쓰기: 4칸.
    tabWidth: 4,
    // 코드 길이 <= 120칸.
    printWidth: 120,
    // Arrow function이 매개변수 1개일 때 괄호 생략.
    arrowParens: 'avoid',
    // Line ending: OS 별로 설정된 값 사용.
    // (Windows CRLF, Linux MacOS LF)
    // Windows : git config --global core.autocrlf true (필수)
    endOfLine: 'auto',
};
