import React, { useEffect } from 'react'

/**
 * 用于拖拽调整调整编辑器和预览部分的宽度
 * @param editorRef 编辑器
 * @param previewRef 预览
 * @param resizeDividerRef 拖动条
 */
export const useEditorResize = (
  editorRef: React.RefObject<HTMLDivElement | undefined>,
  previewRef: React.RefObject<HTMLDivElement | undefined>,
  resizeDividerRef: React.RefObject<HTMLDivElement | undefined>,
) => {
  const onMousedown = () => {
    const targetRect = editorRef.current!.getBoundingClientRect()
    // editor 距离应用左侧的距离
    const targetLeft = targetRect.left

    document.body.style.cursor = 'ew-resize'

    const onMousemove = (e: MouseEvent) => {
      const x = Math.max(0, e.clientX - targetLeft)
      editorRef.current!.style.width = `${x}px`
      previewRef.current!.style.width = `calc(100% - ${x}px)`
    }

    const onMouseup = () => {
      document.body.style.cursor = 'auto'
      document.removeEventListener('mousemove', onMousemove)
      document.removeEventListener('mouseup', onMouseup)
    }

    document.addEventListener('mousemove', onMousemove)
    document.addEventListener('mouseup', onMouseup)
  }

  const onResize = () => {
    if (previewRef.current && editorRef.current && resizeDividerRef.current) {
      resizeDividerRef.current.addEventListener('mousedown', onMousedown)
    }
  }

  const offResize = () => {
    if (previewRef.current && editorRef.current && resizeDividerRef.current) {
      resizeDividerRef.current.removeEventListener('mousedown', onMousedown)
    }
  }
  useEffect(() => {
    onResize()
    return () => {
      offResize()
    }
  })
}
