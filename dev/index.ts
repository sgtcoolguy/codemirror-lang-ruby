import { basicSetup, EditorState } from '@codemirror/basic-setup';
import { css } from '@codemirror/lang-css';
import { EditorView } from '@codemirror/view';
import { ruby, parser } from "../dist/";
import { printTree } from "./print-lezer-tree";
import { oneDark } from '@codemirror/theme-one-dark';

const doc = `
// input sample ruby code here
`

new EditorView({
  state: EditorState.create({
    doc,
    extensions: [basicSetup, ruby(), oneDark, EditorView.lineWrapping],
  }),
  parent: document.querySelector('#editor'),
});

console.log(printTree(parser.parse(doc), doc));
