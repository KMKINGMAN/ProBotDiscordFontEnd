import strings from '@script/locale'
import { useRef, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../ui/tooltip'

export default function ColorsSetItem({
  title,
  colors,
  premium,
  isActive,
  ...props
}) {
  const parentElement = useRef()
  const [showAll, setShowAll] = useState(false)
  const ColorsItems = showAll ? colors : colors.slice(0, 4)

  const hexToRGBA = (hex, opacity) => {
    hex = hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  const BACKGROUND_COLOR = '#1F1F25'

  return (
    <div className="tw-relative" {...props}>
      <div
        onClick={() => {
          localStorage.setItem(`color_sets_onboarding`, 'false'),
            document.getElementById('onboarding')?.remove()
        }}
        style={{
          backgroundColor: `${'#1F1F25'}`,
          border: `2px solid ${
            isActive ? hexToRGBA(colors[0], 0.4) : '#1F1F25'
          }`
        }}
        className={`tw-flex tw-cursor-pointer tw-flex-col tw-gap-5 tw-rounded-lg tw-p-4 tw-duration-200 hover:tw-ring-2 hover:tw-ring-grey-2 md:tw-w-full`}
        ref={parentElement}
      >
        {isActive && (
          <div
            className="tw-z-0"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: hexToRGBA(colors[0], 0.04)
            }}
          />
        )}
        <div className="tw-flex tw-flex-col tw-gap-1">
          <p className="tw-m-0 tw-text-[16px] tw-font-medium">{title}</p>
          <span className="tw-text-gray-300">
            {colors.length} {strings.Colors}
          </span>
        </div>
        <div className="tw-flex tw-w-fit tw-flex-wrap -tw-space-x-1">
          {ColorsItems.map((e, index) => {
            return (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      style={{
                        backgroundColor: e
                      }}
                      key={index}
                      className={`tw-z-0 tw-h-[26px] tw-w-[26px] tw-rounded-full tw-ring-4 tw-ring-grey-4 tw-duration-200 hover:-tw-translate-y-1`}
                      onClick={(event) => event.stopPropagation()}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="tw-m-0 tw-text-s3">{e}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
          {showAll ? (
            <div
              style={{
                backgroundColor: '#434350',
                border: `3px solid ${BACKGROUND_COLOR}`
              }}
              className={`tw-z-0 tw-h-[26px] tw-w-[26px] tw-rounded-full tw-ring-4 tw-ring-grey-4 tw-duration-200 hover:-tw-translate-y-1 tw-text-center`}
              onClick={(event) => {
                event.stopPropagation(setShowAll(false))
              }}
            >
              -
            </div>
          ) : (
            colors.length - 4 && (
              <div
                style={{
                  backgroundColor: '#434350'
                  // border: `3px solid ${BACKGROUND_COLOR}`
                }}
                className={`tw-z-0 tw-flex tw-h-[26px] tw-w-[26px] tw-items-center tw-justify-center tw-rounded-full tw-font-semibold tw-ring-4 tw-ring-grey-4 tw-duration-200 hover:-tw-translate-y-1`}
                onClick={(event) => {
                  event.stopPropagation(setShowAll(true))
                }}
              >
                {colors.length - 4}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
