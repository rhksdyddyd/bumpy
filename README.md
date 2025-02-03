## 소개

WYSIWYG 도형 삽입 및 편집 기능을 제공하는 프로젝트입니다.<br>
MS PowerPoint 제품의 일부 기능을 모방한 클론입니다.<br>
[https://rhksdyddyd.github.io](https://rhksdyddyd.github.io) 에서 테스트 할 수 있습니다.

## node version

node version: v16.20.2<br>
npm version: 8.19.4

## 실행 방법

npm install<br>
npm run serve

## 세부 기능

좌측 상단의 버튼을 클릭하여 도형 삽입 상태로 진입할 수 있습니다.<br>
![edit](/static/insert1.gif)<br>
<br>
중앙의 편집 영역에서 도형 삽입을 진행할 수 있습니다.<br>
중간에 esc 키를 통하여 도형 삽입을 취소할 수 있습니다.<br>
![edit](/static/insert2.gif)<br>
<br>
선택된 도형의 편집용 컨트롤을 이용하여 이동, 크기 변경, 회전 등의 편집을 할 수 있습니다.<br>
중간에 esc 키를 통하여 도형 편집을 취소할 수 있습니다.<br>
![edit](/static/edit.gif)<br>
<br>
ctrl, shift 키를 누른 상태로 클릭하여 여러개의 도형을 선택할 수 있습니다.<br>
esc 키를 통하여 모든 도형의 선택을 해제할 수 있습니다.<br>
![edit](/static/multi_select.gif)<br>
<br>
선택 된 여러 도형을 한번에 편집할 수 있습니다.<br>
![edit](/static/multi_edit.gif)<br>
<br>
ctrl + g 키를 통하여 2개 이상의 도형 또는 그룹을 그룹화 할 수 있습니다.<br>
ctrl + shift + g 키를 통하여 그룹해제 할 수 있습니다.<br>
그룹화 된 도형을 일반 도형과 같이 편집할 수 있습니다.<br>
![edit](/static/group.gif)<br>
<br>
ctrl + z 키를 통하여 편집 내용을 실행 취소 할 수 있습니다.<br>
ctrl + y 키를 통하여 실행 취소한 내용을 재실행 할 수 있습니다.<br>
![edit](/static/undo_redo.gif)<br>
