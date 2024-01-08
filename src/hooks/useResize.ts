import React, { useEffect } from 'react'

/**
 * 拖拽调整窗口大小
 * @param leftRef 编辑器
 * @param rightRef 预览
 * @param resizeDividerRef 拖动条
 */
export const useResize = (
  leftRef: React.RefObject<HTMLDivElement | undefined>,
  rightRef: React.RefObject<HTMLDivElement | undefined>,
  resizeDividerRef: React.RefObject<HTMLDivElement | undefined>,
) => {
  const onMousedown = () => {
    const targetRect = leftRef.current!.getBoundingClientRect()
    // editor 距离应用左侧的距离
    const targetLeft = targetRect.left
    // 父元素
    const parentElement = leftRef.current!.parentElement
    const parentWidth = parentElement!.offsetWidth

    document.body.style.cursor = 'ew-resize'

    const onMousemove = (e: MouseEvent) => {
      const x = Math.max(0, e.clientX - targetLeft)
      if (parentWidth - x <= 200 || x < 200) return

      leftRef.current!.style.width = `${x}px`
      rightRef.current!.style.width = `calc(100% - ${x}px)`
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
    if (rightRef.current && leftRef.current && resizeDividerRef.current) {
      resizeDividerRef.current.addEventListener('mousedown', onMousedown)
    }
  }

  const offResize = () => {
    if (rightRef.current && leftRef.current && resizeDividerRef.current) {
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
