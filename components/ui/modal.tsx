import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@script/utils'
import { createPortal } from 'react-dom'

const Modal = DialogPrimitive.Root
// const ModalClose = DialogPrimitive.Close

const ModalTrigger = DialogPrimitive.Trigger

const ModalClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={
      'tw-m-0 tw-border-none tw-bg-transparent tw-bg-none tw-p-0 tw-outline-none sm:tw-w-full'
    }
    {...props}
  />
))

const ModalPortal = ({
  className,
  ...props
}: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal className={className} {...props} />
)
ModalPortal.displayName = DialogPrimitive.Portal.displayName

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={
      'tw-fixed tw-inset-0 tw-z-[100] tw-flex tw-items-center tw-justify-center tw-bg-black/75 data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0'
    }
    {...props}
  ></DialogPrimitive.Overlay>
))
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <>
    {createPortal(
      <ModalOverlay className="tw-z-[100]">
        <DialogPrimitive.Content
          ref={ref}
          className={
            'tw-mx-auto tw-flex tw-h-fit tw-w-[34rem] tw-flex-col tw-gap-6 tw-rounded-lg tw-border-[1px] tw-border-solid tw-border-grey-2 tw-bg-grey-4 tw-p-5 tw-duration-200 data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0 data-[state=closed]:tw-zoom-out-95 data-[state=open]:tw-zoom-in-95 data-[state=closed]:tw-slide-out-to-bottom-[5%] data-[state=open]:tw-slide-in-from-bottom-[5%] sm:tw-w-full sm:tw-gap-4 sm:tw-p-5'
          }
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </ModalOverlay>,
      document.body
    )}
  </>
))
ModalContent.displayName = DialogPrimitive.Content.displayName

const ModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={'tw-flex tw-flex-col tw-gap-4'} {...props} />
)
ModalHeader.displayName = 'ModalHeader'

const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={
      'tw-mt-2 tw-flex tw-justify-end tw-gap-2 sm:tw-w-full sm:tw-flex-wrap-reverse'
    }
    {...props}
  />
)
ModalFooter.displayName = 'ModalFooter'

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={'tw-m-0 tw-text-s2 tw-capitalize'}
    {...props}
  />
))
ModalTitle.displayName = DialogPrimitive.Title.displayName

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={'tw-m-0 tw-text-s3 tw-text-[#9B9BA6]'}
    {...props}
  />
))
ModalDescription.displayName = DialogPrimitive.Description.displayName

export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose
}
