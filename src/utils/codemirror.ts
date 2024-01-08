import { insertTab, indentLess } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { search } from '@codemirror/search'
import { EditorState, EditorSelection, SelectionRange } from '@codemirror/state'
import { ViewUpdate, keymap, BlockInfo } from '@codemirror/view'
import { EditorView, basicSetup } from 'codemirror'
import pluginMarkdown from 'prettier/plugins/markdown'
import * as prettier from 'prettier/standalone'

import { isBlank } from './obj'

export type TitleType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
enum TitleMapSymbol {
  'h1' = '#',
  'h2' = '##',
  'h3' = '###',
  'h4' = '####',
  'h5' = '#####',
  'h6' = '######',
}

const zhCNPhrases = {
  'Fold line': '折叠',
  'Unfold line': '展开',
  'Go to line': '前往行',
  go: '前往',
  Find: '查找内容',
  Replace: '替换内容',
  next: '下一个',
  previous: '上一个',
  all: '全部',
  'match case': '区分大小写',
  'by word': '全字匹配',
  replace: '替换',
  'replace all': '替换全部',
  close: 'schließen',
  regexp: '使用正则表达式',
}

/**
 * codemirror 样式配置
 * https://codemirror.net/examples/styling/#themes
 */
export const cmTheme: any = {
  '&': {
    color: 'var(--zeus-editor-color)',
    backgroundColor: 'var(--zeus-editor-bg-color)',
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: 'var(--zeus-editor-caret-color)',
  },
  '.cm-content': {
    whiteSpace: 'break-spaces',
    wordWrap: 'break-word',
    width: 'calc(100% - 55px)',
    caretColor: '#528bff',
  },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--zeus-editor-caret-color)' },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
    { backgroundColor: 'var(--zeus-editor-selection-bg-color)' },
  '.cm-panels': {
    backgroundColor: 'var(--zeus-editor-gutters-bg-color)',
    color: 'var(--zeus-editor-color)',
  },
  '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
  '.cm-panels.cm-panels-bottom': {
    borderTop: '2px solid black',
  },
  '.cm-textfield': {
    backgroundColor: 'var(--zeus-editor-bg-color)',
    border: '1px solid var(--zeus-border-color)',
    outline: 'none',
  },
  '.cm-button': {
    backgroundImage: 'none',
    backgroundColor: 'var(--zeus-editor-bg-color)',
    border: '1px solid var(--zeus-border-color)',
  },
  '.cm-button::active': {
    backgroundColor: 'var(--zeus-text-bg-color)',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--zeus-editor-gutters-bg-color)',
    borderColor: 'var(--zeus-editor-gutters-border-color)',
    color: 'var(--zeus-editor-gutters-color)',
    fontSize: '14px',
    fontWeight: '700',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--zeus-editor-gutters-bg-color)',
    color: 'var(--zeus-color-primary)',
  },
  '.cm-lineNumbers': {
    width: '40px',
  },
  '.cm-scroller': {
    overflow: 'overlay',
    outline: 'none',
  },
  '.cm-line': {
    wordWrap: 'break-word',
    wordBreak: 'break-all',
    padding: '0',
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--zeus-editor-active-line-gutter-bg-color)',
  },
  '.cm-selectionMatch': {
    backgroundColor: 'var(--zeus-editor-selection-match-bg-color)',
  },
  '.ͼ1.cm-focused': {
    outline: 'none',
  },
  '.ͼ2 .cm-activeLine': {
    backgroundColor: 'var(--zeus-editor-active-line-gutter-bg-color)',
  },
  '.ͼ5': {
    color: 'var(--zeus-editor-c5-color)',
    fontWeight: '700',
  },
  '.ͼ6': {
    color: '#707070',
    fontWeight: '500',
  },
  '.ͼ7': {
    backgroundColor: 'var(--zeus-editor-c7-bg-color)',
    color: 'var(--zeus-color-primary)',
  },
  '&.ͼo': {
    height: '100%',
  },
  '.ͼc': {
    color: 'var(--zeus-editor-cc-color)',
  },
  // ͼm: 注释   #940
  '.ͼm': {
    color: 'var(--zeus-editor-cm-color)',
  },
  // ͼb: 关键字 #708
  '.ͼb': {
    color: 'var(--zeus-editor-cb-color)',
  },
  // ͼd: 数字 #708
  '.ͼd': {
    color: 'var(--zeus-editor-cd-color)',
  },
  // ͼe: 字符串 #a11
  '.ͼe': {
    color: 'var(--zeus-editor-ce-color)',
  },
  //ͼi: 类名:
  '.ͼi': {
    color: 'var(--zeus-editor-ci-color)',
  },
  //ͼg: 方法名和参数
  '.ͼg': {
    color: 'var(--zeus-editor-cg-color)',
  },
}

export class CodeMirror {
  /**
   * editor
   */
  private _editor: EditorView
  constructor(editor: EditorView) {
    this._editor = editor
  }

  /**
   * 获取编辑器，不建议直接使用该对象，而是对使用到的方法进行封装
   */
  get editor(): EditorView {
    return this._editor
  }

  /**
   * 创建 EditorState
   *
   * @param updateCallback 编辑器内容变动时的回调
   * @param saveCallback 保存内容时的回调
   * @param uploadFileCallback 拖拽上传文件后的会调
   * @param doc 初始化的内容
   * @returns
   */
  static newState = (updateCallback: any, saveCallback: any, uploadFileCallback: any, doc?: string): EditorState => {
    return EditorState.create({
      doc: doc,
      extensions: [
        EditorState.phrases.of(zhCNPhrases),
        basicSetup,
        search({ top: true }),
        markdown({ codeLanguages: languages }),
        EditorView.theme(cmTheme),
        keymap.of([
          { key: 'Tab', run: insertTab },
          { key: 'Shift-Tab', run: indentLess },
          {
            key: 'Ctrl-s',
            mac: 'Cmd-s',
            run() {
              saveCallback()
              return true
            },
          },
          {
            key: 'Alt-b',
            mac: 'Cmd-b',
            run(view: EditorView) {
              CodeMirror.commandBold(view)
              return true
            },
          },
          {
            key: 'Alt-i',
            mac: 'Cmd-i',
            run(view: EditorView) {
              CodeMirror.commandItalic(view)
              return true
            },
          },
          {
            key: 'Alt-s',
            mac: 'Cmd-s',
            run(view: EditorView) {
              CodeMirror.commandStrike(view)
              return true
            },
          },
          {
            key: 'Alt-t',
            mac: 'Cmd-t',
            run(view: EditorView) {
              CodeMirror.commandTable(view)
              return true
            },
          },
          {
            key: 'Alt-e',
            mac: 'Cmd-e',
            run(view: EditorView) {
              CodeMirror.commandCode(view)
              return true
            },
          },
          {
            key: 'Alt-m',
            mac: 'Cmd-m',
            run(view: EditorView) {
              CodeMirror.commandImg(view)
              return true
            },
          },
          {
            key: 'Alt-k',
            mac: 'Cmd-k',
            run(view: EditorView) {
              CodeMirror.commandLink(view)
              return true
            },
          },
          // { key: 'Ctrl-Alt-c', mac: 'Ctrl-Cmd-c', run(view: EditorView) { CodeMirror.commandCheckBox(view); return true } },
          {
            key: 'Ctrl-Alt-p',
            mac: 'Ctrl-Cmd-p',
            run(view: EditorView) {
              CodeMirror.commandSup(view)
              return true
            },
          },
          {
            key: 'Ctrl-Alt-b',
            mac: 'Ctrl-Cmd-b',
            run(view: EditorView) {
              CodeMirror.commandSub(view)
              return true
            },
          },
          {
            key: 'Ctrl-Alt-e',
            mac: 'Ctrl-Cmd-e',
            run(view: EditorView) {
              CodeMirror.commandPre(view)
              return true
            },
          },
          {
            key: 'Ctrl-Alt-s',
            mac: 'Ctrl-Cmd-s',
            run(view: EditorView) {
              CodeMirror.commandSeparator(view)
              return true
            },
          },
          {
            key: 'Shift-Alt-f',
            mac: 'Shift-Cmd-f',
            run(view: EditorView) {
              CodeMirror.commandFormatMarkdown(view)
              return true
            },
          },
        ]),
        EditorView.updateListener.of((viewUpd: ViewUpdate) => {
          if (viewUpd.docChanged) {
            updateCallback()
          }
        }),
        EditorView.domEventHandlers({
          drop(event: DragEvent) {
            uploadFileCallback(event)
            return
          },
          paste(event: ClipboardEvent) {
            uploadFileCallback(event)
            return
          },
        }),
      ],
    })
  }
  /**
   *
   * @param state
   * @param parent
   * @returns
   */
  static newEditor = (state: EditorState, parent: Element | DocumentFragment): EditorView => {
    return new EditorView({
      state: state,
      parent: parent,
    })
  }
  /**
   * 设置变成
   * @param state
   */
  setState = (state: EditorState) => {
    this._editor.setState(state)
    CodeMirror.insert(this._editor, 0, 0, '', 0, 0)
  }

  //#region ============================================================ codemirror 方法封装 ============================================================
  /**
   * 获取指定范围的内容
   * @param editor
   * @param from 开始位置
   * @param to 结束位置
   * @returns 范围内的内容
   */
  static sliceDoc = (editor: EditorView, from?: number, to?: number): string => {
    return editor.state.sliceDoc(from, to)
  }
  /**
   * 获取文档内容
   * @param editor
   * @returns 内容
   */
  static getDocString = (editor: EditorView): string => {
    return editor.state.doc.toString()
  }
  /**
   * 获取文档长度
   * @param editor
   * @returns 长度
   */
  static getDocLength = (editor: EditorView): number => {
    return editor.state.doc.length
  }
  /**
   * 获取当前选中内容, 并返回选中的文本内容, 可以选中多个不同的段落, 多个段落之间会以 \n 换行
   * @param editor
   * @returns 文本内容, 多个选中之间会换行
   */
  static getSelectionRangesText = (editor: EditorView): string => {
    const ranges = editor.state.selection.ranges
    let text = ''
    if (ranges.length > 0) {
      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i]
        if (range != undefined) {
          const rangeText = editor.state.sliceDoc(range.from, range.to)
          if (isBlank(rangeText)) {
            continue
          }
          if (i != 0) {
            text += '\n'
          }
          text += rangeText
        }
      }
    }
    return text
  }
  /**
   * 获取选中的内容
   * @param editor
   * @returns 存在多个选中所以返回数组
   */
  static getSlelctionRangesArr = (editor: EditorView): readonly SelectionRange[] => {
    return editor.state.selection.ranges
  }
  /**
   * 在指定位置(istFrom -> istTo)插入 content, 或将内容替换为 content, 随后选中 (selectFrom -> selectTo)
   * istFrom 与 istTo 相同即为插入，不同即为替换
   * 如果要将光标移动到某处, selectFrom 与 selectTo 相同即可
   *
   * @param istFrom 插入的开始位置
   * @param istTo 插入的结束位置
   * @param content 插入的内容
   * @param selectFrom 插入内容后, 将光标移动到的开始位置
   * @param selectTo 插入内容后, 将光标移动到的结束位置
   */
  static insert = (
    editor: EditorView,
    istFrom: number,
    istTo: number,
    content: string,
    selectFrom: number,
    selectTo: number,
  ) => {
    const changeByRange = {
      /* 创建变更的内容, 可以是个数组, 说明同时修改多个部分 */
      changes: [{ from: istFrom, to: istTo, insert: content }],
      /* 修改之后光标移动到的位置 */
      selection: EditorSelection.create([EditorSelection.range(selectFrom, selectTo)]),
    }

    editor.dispatch(changeByRange)
  }
  sliceDoc = (from?: number, to?: number): string => {
    return this._editor.state.sliceDoc(from, to)
  }
  getDocString = (): string => {
    return CodeMirror.getDocString(this._editor)
  }
  getDocLength = (): number => {
    return CodeMirror.getDocLength(this._editor)
  }
  getSelectionRangesText = (): string => {
    return CodeMirror.getSelectionRangesText(this._editor)
  }
  getSlelctionRangesArr = (): readonly SelectionRange[] => {
    return CodeMirror.getSlelctionRangesArr(this._editor)
  }
  getDocumentTop = (): number => {
    return this._editor.documentTop
  }
  getElementAtHeight = (height: number): BlockInfo => {
    return this._editor.elementAtHeight(height)
  }
  getLineBlockAtHeight = (height: number): BlockInfo => {
    return this._editor.lineBlockAtHeight(height)
  }
  insert = (istFrom: number, istTo: number, content: string, selectFrom: number, selectTo: number) => {
    CodeMirror.insert(this._editor, istFrom, istTo, content, selectFrom, selectTo)
  }
  //#endregion
  //#region ============================================================ 自定义命令 ============================================================
  /**
   * 行内格式的替换命令, 用于前后缀相同的格式, 如 `**` / `~~` 等
   *
   * @param editor 编辑器
   * @param range 范围
   * @param target 添加的前后缀字符, 如加粗是 **, 行内代码块是 `
   */
  static replaceInlineCommand = (editor: EditorView, range: SelectionRange, target: string): any => {
    const len = target.length

    const prefixFrom: number = range.from - len
    const prefixTo: number = range.from
    const prefix = this.sliceDoc(editor, prefixFrom, prefixTo)

    const suffixFrom: number = range.to
    const suffixTo: number = range.to + len
    const suffix = this.sliceDoc(editor, suffixFrom, suffixTo)
    if (target.startsWith('#')) {
      // 判断是取消还是添加, 如果被选中的文本前后已经是 target 字符, 则删除前后字符
      if (prefix == target && suffix == target) {
        return {
          changes: [{ from: prefixFrom, to: prefixTo, insert: '' }],
          range: EditorSelection.range(prefixFrom, suffixFrom - len),
        }
      } else {
        return {
          changes: [{ from: range.from, insert: `${target} ` }],
          range: EditorSelection.range(range.from + len, range.to + len),
        }
      }
    } else {
      // 判断是取消还是添加, 如果被选中的文本前后已经是 target 字符, 则删除前后字符
      if (prefix == target && suffix == target) {
        return {
          changes: [
            { from: prefixFrom, to: prefixTo, insert: '' },
            { from: suffixFrom, to: suffixTo, insert: '' },
          ],
          range: EditorSelection.range(prefixFrom, suffixFrom - len),
        }
      } else {
        return {
          changes: [
            { from: range.from, insert: target },
            { from: range.to, insert: target },
          ],
          range: EditorSelection.range(range.from + len, range.to + len),
        }
      }
    }
  }

  /**
   * 行内格式的替换命令, 用于前后缀不同的格式, 如 `<sup></sup>`等
   *
   * @param editor 编辑器
   * @param range  范围
   * @param prefixTarget 前缀
   * @param suffixTarget 后缀
   * @returns
   */
  static replaceDifInlineCommand = (
    editor: EditorView,
    range: SelectionRange,
    prefixTarget: string,
    suffixTarget: string,
  ): any => {
    const prefixLen = prefixTarget.length
    const suffixLen = suffixTarget.length

    const prefixFrom: number = range.from - prefixLen
    const prefixTo: number = range.from
    const prefix = this.sliceDoc(editor, prefixFrom, prefixTo)

    const suffixFrom: number = range.to
    const suffixTo: number = range.to + suffixLen
    const suffix = this.sliceDoc(editor, suffixFrom, suffixTo)

    // 判断是取消还是添加, 如果被选中的文本前后已经是 target 字符, 则删除前后字符
    if (prefix == prefixTarget && suffix == suffixTarget) {
      return {
        changes: [
          { from: prefixFrom, to: prefixTo, insert: '' },
          { from: suffixFrom, to: suffixTo, insert: '' },
        ],
        range: EditorSelection.range(prefixFrom, range.to - prefixLen),
      }
    } else {
      return {
        changes: [
          { from: range.from, insert: prefixTarget },
          { from: range.to, insert: suffixTarget },
        ],
        range: EditorSelection.range(range.from + prefixLen, range.to + prefixLen),
      }
    }
  }
  /**
   * 将选中内容替换为 content, 如果没有选中, 则在光标位置插入
   * @param editor 编辑器
   * @param content 插入的内容
   */
  static insertBlockCommand = (editor: EditorView, content: string) =>
    editor.dispatch(editor.state.replaceSelection(content))
  /** 选中内容加粗 */
  private static commandBold = (editor: EditorView) =>
    editor.dispatch(
      editor.state.changeByRange((range: SelectionRange) => this.replaceInlineCommand(editor, range, '**')),
    )
  /** 选中内容设置为标题 */
  private static commandTitle = (editor: EditorView, type: TitleType) =>
    editor.dispatch(
      editor.state.changeByRange((range: SelectionRange) =>
        this.replaceInlineCommand(editor, range, TitleMapSymbol[type]),
      ),
    )
  /** 选中内容斜体 */
  private static commandItalic = (editor: EditorView) =>
    editor.dispatch(
      editor.state.changeByRange((range: SelectionRange) => this.replaceInlineCommand(editor, range, '*')),
    )
  /** 选中内容增加删除线 */
  private static commandStrike = (editor: EditorView) =>
    editor.dispatch(
      editor.state.changeByRange((range: SelectionRange) => this.replaceInlineCommand(editor, range, '~~')),
    )
  /** 选择内容设置为行内代码块 */
  private static commandCode = (editor: EditorView) =>
    editor.dispatch(
      editor.state.changeByRange((range: SelectionRange) => this.replaceInlineCommand(editor, range, '`')),
    )
  /** 选择内容设置为上标 */
  private static commandSup = (editor: EditorView) =>
    editor.dispatch(
      editor.state.changeByRange((range: SelectionRange) =>
        this.replaceDifInlineCommand(editor, range, '<sup>', '</sup>'),
      ),
    )
  /** 选择内容设置为下标 */
  private static commandSub = (editor: EditorView) =>
    editor.dispatch(
      editor.state.changeByRange((range: SelectionRange) =>
        this.replaceDifInlineCommand(editor, range, '<sub>', '</sub>'),
      ),
    )
  /** 在当前位置增加表格 */
  private static commandTable = (editor: EditorView) => this.insertBlockCommand(editor, `\n|||\n|---|---|\n|||\n`)
  /** 在当前位置增加多行代码块 */
  private static commandPre = (editor: EditorView) => this.insertBlockCommand(editor, `\n\`\`\`text\n\n\`\`\`\n`)
  /** 在当前位置增加单选框 */
  private static commandCheckBox = (editor: EditorView) => this.insertBlockCommand(editor, `\n- [ ] \n`)
  /** 在当前位置增加分割线 */
  private static commandSeparator = (editor: EditorView) => this.insertBlockCommand(editor, `\n---\n`)
  /** 在当前位置增加引用 */
  private static commandQuote = (editor: EditorView) => this.insertBlockCommand(editor, `\n>\n>\n`)
  /** 在当前位置增加引用 black */
  private static commandQuoteBlack = (editor: EditorView) => this.insertBlockCommand(editor, `\n> ##black##\n> ⚫\n`)
  /** 在当前位置增加引用 green */
  private static commandQuoteGreen = (editor: EditorView) => this.insertBlockCommand(editor, `\n> ##green##\n> 🟢\n`)
  /** 在当前位置增加引用 yellow */
  private static commandQuoteYellow = (editor: EditorView) => this.insertBlockCommand(editor, `\n> ##yellow##\n> 🟡\n`)
  /** 在当前位置增加引用 red */
  private static commandQuoteRed = (editor: EditorView) => this.insertBlockCommand(editor, `\n> ##red##\n> 🔴\n`)
  /** 在当前位置增加引用 blue */
  private static commandQuoteBlue = (editor: EditorView) => this.insertBlockCommand(editor, `\n> ##blue##\n> 🔵\n`)
  /** 在当前位置增加引用 */
  private static commandQuotePurple = (editor: EditorView) => this.insertBlockCommand(editor, `\n> ##purple##\n> 🟣\n`)
  /** 在当前位置增加无序列表 */
  private static commandUnordered = (editor: EditorView) => this.insertBlockCommand(editor, `\n- \n`)
  /** 在当前位置增加有序列表 */
  private static commandOrdered = (editor: EditorView) => this.insertBlockCommand(editor, `\n1. \n`)
  /** 在当前位置增加图片 */
  private static commandImg = (editor: EditorView) => this.insertBlockCommand(editor, `\n![]()\n`)
  /** 在当前位置增加链接 */
  private static commandLink = (editor: EditorView) => this.insertBlockCommand(editor, `\n[]()\n`)
  /** 格式化内容, 使用 prettier */
  private static commandFormatMarkdown = (editor: EditorView) => {
    prettier
      .format(CodeMirror.getDocString(editor), { semi: false, parser: 'markdown', plugins: [pluginMarkdown] })
      .then((formatContent) => {
        const maxLen = CodeMirror.getDocLength(editor)
        const position = editor.state.selection.main.from
        CodeMirror.insert(editor, 0, maxLen, formatContent, position, position)
      })
  }
  /** 转为大写 */
  private static toUpper = (editor: EditorView) => {
    editor.dispatch(
      editor.state.changeByRange((range: SelectionRange) => {
        const text = this.sliceDoc(editor, range.from, range.to)
        return {
          changes: [{ from: range.from, to: range.to, insert: text.toLocaleUpperCase() }],
          range: EditorSelection.range(range.from, range.to),
        }
      }),
    )
  }
  /** 转为小写 */
  private static toLower = (editor: EditorView) => {
    editor.dispatch(
      editor.state.changeByRange((range: SelectionRange) => {
        const text = this.sliceDoc(editor, range.from, range.to)
        return {
          changes: [{ from: range.from, to: range.to, insert: text.toLocaleLowerCase() }],
          range: EditorSelection.range(range.from, range.to),
        }
      }),
    )
  }
  // 实例调用
  insertBlockCommand = (content: string) => CodeMirror.insertBlockCommand(this._editor, content)
  commandBold = () => CodeMirror.commandBold(this._editor)
  commandTitle = (type: TitleType) => CodeMirror.commandTitle(this._editor, type)
  commandItalic = () => CodeMirror.commandItalic(this._editor)
  commandStrike = () => CodeMirror.commandStrike(this._editor)
  commandCode = () => CodeMirror.commandCode(this._editor)
  commandSup = () => CodeMirror.commandSup(this._editor)
  commandSub = () => CodeMirror.commandSub(this._editor)
  commandTable = () => CodeMirror.commandTable(this._editor)
  commandPre = () => CodeMirror.commandPre(this._editor)
  commandCheckBox = () => CodeMirror.commandCheckBox(this._editor)
  commandSeparator = () => CodeMirror.commandSeparator(this._editor)
  commandQuote = () => CodeMirror.commandQuote(this._editor)
  commandQuoteBlack = () => CodeMirror.commandQuoteBlack(this._editor)
  commandQuoteGreen = () => CodeMirror.commandQuoteGreen(this._editor)
  commandQuoteYellow = () => CodeMirror.commandQuoteYellow(this._editor)
  commandQuoteRed = () => CodeMirror.commandQuoteRed(this._editor)
  commandQuoteBlue = () => CodeMirror.commandQuoteBlue(this._editor)
  commandQuotePurple = () => CodeMirror.commandQuotePurple(this._editor)
  commandUnordered = () => CodeMirror.commandUnordered(this._editor)
  commandOrdered = () => CodeMirror.commandOrdered(this._editor)
  commandImg = () => CodeMirror.commandImg(this._editor)
  commandLink = () => CodeMirror.commandLink(this._editor)
  toUpper = () => CodeMirror.toUpper(this._editor)
  toLower = () => CodeMirror.toLower(this._editor)
  commandFormatMarkdown = async () => CodeMirror.commandFormatMarkdown(this._editor)
}
