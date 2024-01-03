/**
 * 随机整数范围 min <= return < max
 * @param min
 * @param max
 * @returns
 */
export const randomInt = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

type ArticleHtmlEvent = 'copyPreCode' | 'showArticleReferenceView'
/**
 * HTML事件分发
 * @param _t dom节点
 * @param _ty event 类型
 * @param event 事件 e
 * @param type 自定义类型type
 * @param data 自定义属性
 */
export const onHtmlEventDispatch = (_t: any, _ty: any, event: any, type: ArticleHtmlEvent, data: any) => {
  if (type === 'copyPreCode') {
    const code = document.getElementById(data)
    if (code) {
      writeText(code.innerText)
    }
    return
  }
}

/**
 * 复制code
 * @param text code内容
 */
export const writeText = (text: string): void => {
  if (navigator.clipboard && window.isSecureContext) {
    const type = 'text/plain'
    const blob = new Blob([text], { type })
    const data = [new ClipboardItem({ [type]: blob })]
    navigator.clipboard.write(data).then(
      () => {},
      () => {},
    )
  } else {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'absolute'
    textArea.style.opacity = '0'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    new Promise<void>((res, rej) => {
      document.execCommand('copy') ? res() : rej()
      textArea.remove()
    })
  }
}
