import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const button = cva('button', {
  variants: {
    intent: {
      primary: [
        'tw-bg-[#605ceb] tw-border-solid tw-border-[#6965F5] hover:tw-bg-[#807eea] tw-transition-all tw-duration-150 tw-rounded-md'
      ],
      secondary: [
        'tw-bg-gray-850 tw-border-solid tw-border-gray-800 hover:tw-bg-gray-800 tw-transition-all tw-duration-150 tw-rounded-md'
      ],
      ghost: [
        'tw-bg-white',
        'tw-text-gray-800',
        'tw-border-gray-400',
        'hover:tw-bg-gray-100'
      ],
      invisible: ['tw-bg-transparent', 'tw-text-white', 'tw-border-transparent']
    },
    size: {
      xsmall: ['tw-text-sm tw-py-1 tw-px-2'],
      small: ['tw-text-base tw-py-2 tw-px-4'],
      medium: ['tw-text-base tw-py-3 tw-px-6 sm:tw-py-4']
    }
  },
  compoundVariants: [{ intent: 'primary', size: 'medium' }],
  defaultVariants: {
    intent: 'primary',
    size: 'medium'
  }
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button: React.FC<ButtonProps> = ({
  className,
  intent,
  size,
  ...props
}) => <button className={button({ intent, size, className })} {...props} />
