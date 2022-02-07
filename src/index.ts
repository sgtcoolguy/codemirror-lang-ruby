import { parser as rubyParser } from "./syntax.grammar";
import {
  LRLanguage,
  LanguageSupport,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  delimitedIndent,
  continuedIndent,
} from "@codemirror/language";
import { styleTags, tags as t } from "@codemirror/highlight";
import {
  completeFromList,
  ifNotIn,
  Completion,
  snippetCompletion as snip,
} from "@codemirror/autocomplete";

export const parser = rubyParser;

export const rubyLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Parenthesized: delimitedIndent({ closing: ")" }),
        AttrSet: delimitedIndent({ closing: "}" }),
        List: delimitedIndent({ closing: "]" }),
        Let: continuedIndent({ except: /^\s*in\b/ }),
      }),
      foldNodeProp.add({
        AttrSet: foldInside,
        List: foldInside,
        Let(node) {
          let first = node.getChild("let"),
            last = node.getChild("in");
          if (!first || !last) return null;
          return { from: first.to, to: last.from };
        },
      }),
      styleTags({
        "for while do if else switch begin rescue ensure return throw break continue default case": t.controlKeyword,
        "def end class": t.definitionKeyword,
        VarName: t.variableName,
        BooleanLiteral: t.bool,
        String: t.string,
        LineComment: t.lineComment,
        BlockComment: t.blockComment,
        // Float: t.float,
        Number: t.integer,
        Symbol: t.atom,
        Null: t.null,
        "( )": t.paren,
        "{ }": t.brace,
        "[ ]": t.squareBracket,
        "if then else unless": t.controlKeyword,
        "import with let in rec builtins inherit assert or": t.keyword,
        ", ;": t.separator,
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: "#", block: { open: "/*", close: "*/" } },
    closeBrackets: { brackets: ["(", "[", "{", "''", '"'] },
    indentOnInput: /^\s*(in|\}|\)|\])$/,
  },
});

const snippets: readonly Completion[] = [
  snip("let ${binds} in ${expression}", {
    label: "let",
    detail: "Let ... in statement",
    type: "keyword",
  }),
  snip("with ${expression}; ${expression}", {
    label: "with",
    detail: "With statement",
    type: "keyword",
  }),
];

export function ruby() {
  return new LanguageSupport(
    rubyLanguage,
    rubyLanguage.data.of({
      autocomplete: ifNotIn(
        ["LineComment", "BlockComment", "String", "IndentedString"],
        completeFromList(snippets)
      ),
    })
  );
}
