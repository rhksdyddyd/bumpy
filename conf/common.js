const fs = require('fs');
const path = require('path');

// 자주 사용하는 경로들의 모음.
const commonPaths = {};

// 프로젝트의 절대 경로.
commonPaths.rootPath = path.resolve(__dirname, '..');

// 소스 코드 (TypeScript, SCSS, HTML, ...) 경로.
commonPaths.srcPath = path.join(commonPaths.rootPath, 'src');

// Git submodule 경로.
commonPaths.modulePath = path.join(commonPaths.srcPath, 'module');

// 빌드한 파일들을 담을 경로.
commonPaths.outPath = path.join(commonPaths.rootPath, 'dist');

// 단위 테스트 (unit test) 코드 경로.
commonPaths.testPath = path.join(commonPaths.rootPath, 'test');

// resource 파일 경로.
commonPaths.resourcePath = path.join(commonPaths.rootPath, 'resource');

// Config 파일들의 경로.
commonPaths.confPath = path.join(commonPaths.rootPath, 'conf');

module.exports = { commonPaths };
