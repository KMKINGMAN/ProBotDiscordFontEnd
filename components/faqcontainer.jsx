import React, { useState } from 'react'


export default function FaqContainer({ title, content }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      onClick={() => setIsOpen((prevState) => !prevState)}
      className={`${''} tw-bg-grey-4 tw-mt-2 tw-flex tw-flex-col tw-rounded tw-transition-all tw-duration-200 tw-cursor-pointer hover:tw-bg-[#232329]`}
    >
      <div className="tw-outline-none tw-flex tw-p-6 tw-flex-row tw-justify-between tw-border-b-2 tw-border-grey-text2">
        <span className="tw-text-base">{title}</span>
        <span className="faq__arrow">
          {isOpen ? (
            <i className="fas fa-chevron-up"></i>
          ) : (
            <i className="fas fa-chevron-down"></i>
          )}
        </span>
      </div>
      <span
        className={`tw-px-6 tw-pb-6 tw-text-grey-text2 ${
          isOpen ? '' : 'tw-hidden'
        }`}
      >
        {content}
      </span>
    </div>
  )
}
