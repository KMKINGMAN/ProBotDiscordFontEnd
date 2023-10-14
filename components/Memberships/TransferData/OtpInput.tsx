import React, { useState, useRef, useContext } from 'react'
import { Context } from '@script/_context'

const OtpInput = ({
  setOtp,
  otp,
  placeholder
}: {
  otp: string
  setOtp: React.Dispatch<React.SetStateAction<string>>
  placeholder: string
}) => {
  const { rtl } = useContext(Context)
  const inputRefs = useRef([])
  const MAX_LENGTH = 6

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target
    const prevOtp = otp
    const otpArray = prevOtp.split('')
    otpArray[index] = value

    if (otpArray.join('').length >= MAX_LENGTH + 1) return
    setOtp(otpArray.join(''))

    if (value && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text/plain')
    const otpArray = pasteData.split('').slice(0, MAX_LENGTH)
    setOtp(otpArray.join(''))
    inputRefs.current[0].focus()
  }

  return (
    <div className={`otp-container ${rtl ? 'tw-flex-row-reverse' : ''}`}>
      {Array.from({ length: MAX_LENGTH }, (_, index) => (
        <input
          className="focus:tw-outline-none focus:tw-border focus:tw-border-solid focus:tw-border-purple-main"
          key={index}
          type="number"
          maxLength={1}
          value={otp.charAt(index)}
          onChange={(e) => handleChange(e, index)}
          onPaste={handlePaste}
          ref={(el) => (inputRefs.current[index] = el)}
          placeholder={placeholder}
          {...(index === 0 ? { autoFocus: true } : null)}
        />
      ))}
    </div>
  )
}

export default OtpInput
