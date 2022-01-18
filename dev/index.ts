import { basicSetup, EditorState } from '@codemirror/basic-setup';
import { EditorView } from '@codemirror/view';
import { ruby, parser } from "../dist/";
import { printTree } from "./print-lezer-tree";
import { oneDark } from '@codemirror/theme-one-dark';

const doc = `
=begin
  Multi-line comment
=end
$global = 1234;
# input sample ruby code here
identifier = 'string';
@var = 1_234.56e7;

something = true;

`

new EditorView({
  state: EditorState.create({
    doc,
    extensions: [basicSetup, ruby(), oneDark, EditorView.lineWrapping],
  }),
  parent: document.querySelector('#editor'),
});

console.log(printTree(parser.parse(doc), doc));
