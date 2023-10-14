import React, { useState, useEffect } from 'react'
import strings from '@script/locale'
import Image from 'next/image'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

interface OnboardingpProps {
  text: string
  title: string
  image?: string
  item: string
  side: 'top' | 'right' | 'bottom' | 'left'
  align: 'center' | 'start' | 'end'
  sideOffset: number
  children: React.ReactNode
}

const TooltipProvider = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Provider>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>
>(({ delayDuration, ...props }) => (
  <TooltipPrimitive.Provider delayDuration={200} {...props} />
))
const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipArrow = TooltipPrimitive.Arrow

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={
      'tw-z-50 tw-flex tw-flex-col tw-overflow-hidden tw-animate-in tw-fade-in-0 tw-zoom-in-95 tw-duration-300 data-[state=closed]:tw-animate-out data-[state=closed]:tw-fade-out-0 data-[state=closed]:tw-zoom-out-95 data-[side=bottom]:tw-slide-in-from-top-2 data-[side=left]:tw-slide-in-from-right-2 data-[side=right]:tw-slide-in-from-left-2 data-[side=top]:tw-slide-in-from-bottom-2'
    }
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

const Onboarding: React.FC<OnboardingpProps> = ({
  title,
  text,
  item,
  children,
  image,
  side,
  align,
  sideOffset
}) => {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const isOnboardingVisible = localStorage.getItem(`${item}_onboarding`)
    if (isOnboardingVisible) {
      setShowOnboarding(false)
    } else {
      setShowOnboarding(true)
    }
  }, [])

  const HideOnboard = () => {
    setShowOnboarding(false)
    localStorage.setItem(`${item}_onboarding`, 'false')
  }

  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip open={showOnboarding}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          id="onboarding"
          hideWhenDetached
          side={side}
          align={align}
          avoidCollisions
          sideOffset={sideOffset}
        >
          <TooltipArrow className="tw-relative tw-h-2 tw-w-4 tw-fill-purple-main" />
          <div className="tw-flex tw-max-w-[300px] tw-flex-col tw-items-start tw-justify-start tw-gap-2 tw-rounded-lg tw-bg-purple-main tw-p-4 sm:tw-m-0 sm:tw-max-w-[250px] sm:tw-p-3">
            {image ? (
              <Image
                src={image}
                alt={title}
                width={145}
                height={95}
                className="tw-rounded-lg"
              />
            ) : null}
            <p className="tw-m-0 tw-mb-1 tw-rounded tw-bg-white tw-px-2 tw-py-[2px] tw-text-[13px] tw-font-bold tw-text-purple-main">
              {strings.new}
            </p>
            <div className="tw-space-y-2">
              <p className="tw-m-0 tw-text-[12px] tw-text-s2 tw-font-semibold">
                {title}
              </p>
              <p className="tw-m-0 tw-text-s3">{text}</p>
            </div>
            <button
              className="tw-btn tw-mt-2 tw-w-full tw-appearance-none tw-bg-[#6c77ee] tw-py-2 tw-text-s3 tw-duration-200 hover:tw-bg-[#7d86f0]"
              onClick={HideOnboard}
              type={'button'}
            >
              {strings.got_it}
            </button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Onboarding
