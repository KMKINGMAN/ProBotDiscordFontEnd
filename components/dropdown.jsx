import Drop from 'rc-dropdown'
import { useEffect, useRef } from 'react'

export default function Dropdown(props) {
  const dropdownRef = useRef(null)
  const overlayRef = useRef(null)
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)
    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [])
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      overlayRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !overlayRef.current.contains(event.target)
    ) {
      console.log('outside', props.visible, props.onClickOutside)
      if (props.onClickOutside) props.onClickOutside()
    }
  }
  return (
    <div
      ref={dropdownRef}
      style={{ padding: 0, margin: 0, display: 'contents' }}
    >
      <Drop
        prefixCls={'dropdown'}
        getPopupContainer={() => document.getElementById('main')}
        {...props}
        overlay={<div ref={overlayRef}>{props.overlay}</div>}
      >
        <div>{props.children}</div>
      </Drop>
    </div>
  )
}
