import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import PulseLoader from 'react-spinners/PulseLoader'
import { cn } from '@script/utils'

// usage:
//   <Button
//     intent={'primary'}
//     isLoading={Loading}
//     size={'small'}
//     onClick={() => {}}
//   >
//     Apply
//   </Button>

const button = cva(
  'tw-rounded-[5px] tw-border-0 tw-text-center tw-font-medium tw-text-white tw-outline-none tw-transition-colors tw-duration-200 tw-ease-in-out first-letter:tw-uppercase',
  {
    variants: {
      intent: {
        primary: ['tw-bg-purple-main hover:tw-bg-purple-hover'],
        secondary: ['tw-bg-grey-2 hover:tw-bg-grey-1'],
        ghost: ['tw-bg-transparent hover:tw-bg-grey-2'],
        danger: ['tw-bg-[#ED4C5C] hover:tw-bg-[#d03747]']
      },
      size: {
        xsmall: ['tw-text-sm tw-py-1 tw-px-2'],
        small: ['tw-text-base tw-py-2 tw-px-3'],
        medium: ['tw-text-s3 tw-px-5 tw-py-2 sm:tw-px-4 sm:tw-py-2']
      }
    },
    compoundVariants: [{ intent: 'primary', size: 'medium' }],
    defaultVariants: {
      intent: 'primary',
      size: 'medium'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, intent, isLoading, size, ...props }) => {
    return (
      <button
        className={cn(button({ intent, size }), className)}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <PulseLoader
            color="rgba(255, 255, 255, 0.7)"
            size={7}
            speedMultiplier={0.5}
          />
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'
