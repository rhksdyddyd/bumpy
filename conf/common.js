const fs = require('fs');
const path = require('path');

/**
 * 주어진 경로 밑의 폴더들의 목록을 반환.
 */
function getDirectories(sourcePath) {
    return fs
        .readdirSync(sourcePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

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

// Git submodule들의 이름들. (ex. ['office-core', ...])
const moduleNames = [];

function addToZipInternal({ zip, targetPath, createFolder, excludePattern, logPrefix = '|- ' }) {
    if (excludePattern !== null && excludePattern.test(targetPath)) {
        return;
    }

    const stat = fs.lstatSync(targetPath);
    const isDirectory = stat.isDirectory();
    const basename = path.basename(targetPath);

    if (isDirectory) {
        const subPaths = fs.readdirSync(targetPath);
        const zipFolder = createFolder ? zip.folder(basename) : zip;

        console.log(`${logPrefix}폴더 ${basename}`);

        for (const subPath of subPaths) {
            addToZipInternal({
                zip: zipFolder,
                targetPath: path.join(targetPath, subPath),
                createFolder: true,
                excludePattern,
                logPrefix: '| ' + logPrefix,
            });
        }
    } else {
        console.log(`${logPrefix}파일 ${basename}`);
        const targetContent = fs.readFileSync(targetPath);
        zip.file(basename, targetContent);
    }
}

/**
 * 주어진 zip에 targetPath 폴더/파일을 추가합니다.
 * 폴더일 경우 내용물들을 재귀적으로 추가합니다.
 *
 * @param zip JSZip 인스턴스
 * @param targetPath 추가할 폴더/파일
 * @param createFolder targetPath가 폴더일 때, 이 값이 true이면 zip 아래에 폴더를 생성하고, false이면 폴더 내용물들만 추가함
 * @param excludePattern 정규식을 할당할 경우, 경로가 해당 정규식에 해당하는 파일들은 추가하지 않음
 */
function addToZip({ zip, targetPath, createFolder, excludePattern = null }) {
    addToZipInternal({ zip, targetPath, createFolder, excludePattern });
}

/**
 * 주어진 zip을 파일로 저장합니다.
 *
 * @param zip JSZip 인스턴스
 * @param savePath 설정할 파일명 (ex. abc/def/xyz.zip)
 */
async function saveZip(zip, savePath) {
    return new Promise(resolve => {
        zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
            .pipe(fs.createWriteStream(savePath))
            .on('finish', () => {
                resolve();
            });
    });
}

module.exports = { getDirectories, commonPaths, moduleNames, addToZip, saveZip };
