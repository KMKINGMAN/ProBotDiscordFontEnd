import * as React from 'react'
import Modal from 'react-modal'
import { useFormik } from 'formik'
import { createElement, useState } from 'react'
import Otp from './OtpInput'
import Image from 'next/image'
import * as yup from 'yup'
import Input from '@component/Input'
import axios from 'axios'
import { Context } from '@script/_context'
import { getLocaleError } from '@script/handle_error'
import strings from '@script/locale';
import timeFormat from 'humanize-duration';

function OldAccount({
  step,
  setStep,
  handleCloseModal,
  globalState,
  setGlobalState
}) {
  const { Toast } = React.useContext(Context)
  const formik = useFormik({
    initialValues: {
      accountId: '',
      email: ''
    },
    onSubmit: async (values) => {
      try {
        await axios.post('/membership/email-verify', {
          oldId: `${values.accountId}`,
          email: values.email
        })
        setGlobalState({ ...globalState, oldId: values.accountId, email: values.email })
        setStep(step + 1)
      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: error.response.data.strings
            ? getLocaleError(error)
            : error.response.data.message
        })
        console.log(error.response.data.message)
      }
    },
    validationSchema: yup.object({
      accountId: yup.string().required(strings.membership_transfer_id_required),
      email: yup
        .string()
        .required(strings.membership_transfer_email_required)
        .email(strings.invalid_email_address)
    })
  })

  const handleBack = () => handleCloseModal()

  return (
    <form onSubmit={formik.handleSubmit} className="memberships__form-space">
      <div className="body">
        <div>
          <label htmlFor="accountId" className="control-label">
            {strings.membership_transfer_modal_id}
          </label>
          <Input
            showErrorMessage
            error={formik.errors.accountId}
            value={formik.values.accountId}
            id="accountId"
            onChange={formik.handleChange}
          />
        </div>
        <div>
          <label htmlFor="email" className="control-label">
            {strings.membership_transfer_modal_email}
          </label>
          <Input
            showErrorMessage
            error={formik.errors.email}
            value={formik.values.email}
            id="email"
            onChange={formik.handleChange}
          />
        </div>
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={handleBack}>
          {strings.cancel}
        </button>
        <button className="btn btn-secondary" type="submit">
          {strings.membership_modal_next_step}
        </button>
      </div>
    </form>
  )
}

function VerifyAccount({ step, setStep, globalState, setGlobalState }) {
  const { Toast } = React.useContext(Context)
  const formik = useFormik({
    initialValues: {
      code: ''
    },
    onSubmit: async (values) => {
      try {
        setGlobalState({ ...globalState, ...values })
        const { data } = await axios.post('/membership/check-code', {
          userId: globalState.oldId,
          code: values.code
        })

        setStep(step + 1)
        setGlobalState({ ...globalState, ...values, ...data.user })
      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: error.response.data.strings
            ? getLocaleError(error)
            : strings.membership_code_notmatch
        })
      }
    },
    validationSchema: yup.object({
      code: yup
        .string()
        .required(strings.membership_code_required)
        .matches(/^[0-9]{6}$/, strings.membership_code_length)
    })
  })
  const [timeLeft, setTimeLeft] = useState(15 * 60)

  React.useEffect(() => {
    if (!timeLeft) return
    const timer = setTimeout(() => {
      setTimeLeft((timeLeft) => timeLeft - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  const handleBack = () => {
    formik.setFieldValue('code', '')
    setStep(step - 1)
  }

  return (
    <form onSubmit={formik.handleSubmit} className="memberships__form-space">
      <div className="body">
        <div>
          <label htmlFor="code" className="control-label">
            {strings.code}
          </label>
          <Otp
            otp={formik.values.code}
            setOtp={(value) => formik.setFieldValue('code', value)}
            placeholder="-"
          />
        </div>
        {timeLeft === 0 ? (
          <label className="control-label">
            {strings.membership_code_expired}
          </label>
        ) : (
          <label className="control-label">
            {strings.formatString(
              strings.membership_transfer_modal_verify_timer,
              timeFormat(timeLeft * 1000, { round: true, language: strings.getLanguage() })
            )}
          </label>
        )}
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={handleBack}>
          {strings.back}
        </button>
        <button className="btn btn-secondary" type="submit">
          {strings.membership_verify}
        </button>
      </div>
    </form>
  )
}

function Confirmation({ handleCloseModal, globalState, setStep }) {
  const { user, Toast } = React.useContext(Context)
  const [avatarSrc, setAvatarSrc] = useState({
    old: user.avatar || '',
    new: globalState.avatar || ''
  })
  const handleClose = () => handleCloseModal()
  const transfer = async () => {
    try {
      const { data } = await axios.post('/membership/account-transfer', {
        oldId: globalState.oldId,
        code: globalState.code
      })

      Toast.fire({
        icon: data.error ? "error" : "success",
        title: data.message
      })
      handleClose()
    } catch (error) {
      setStep(0)
      Toast.fire({
        icon: 'error',
        title: error.response.data.message
      })
    }
  }

  return (
    <div className="memberships__form-space">
      <div className="body memberships__transfer">
      <div className="memberships__new-account">
          <Image
            src={avatarSrc.new}
            width={50}
            height={50}
            alt="new-avatar"
            onError={() => {
              setAvatarSrc({
                ...avatarSrc,
                new: `https://cdn.discordapp.com/embed/avatars/${
                  user.discriminator % 5
                }.png`
              })
            }}
          />
          <div>
            <h5>{`${globalState.name}#${globalState.discriminator}`}</h5>
          </div>
        </div>
        <svg
          width="15"
          height="10"
          viewBox="0 0 15 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.4596 5.45962C14.7135 5.20578 14.7135 4.79422 14.4596 4.54038L10.323 0.403805C10.0692 0.149964 9.65765 0.149964 9.40381 0.403805C9.14996 0.657646 9.14996 1.0692 9.40381 1.32304L13.0808 5L9.40381 8.67695C9.14997 8.9308 9.14997 9.34235 9.40381 9.59619C9.65765 9.85003 10.0692 9.85003 10.323 9.59619L14.4596 5.45962ZM5.68248e-08 5.65L14 5.65L14 4.35L-5.68248e-08 4.35L5.68248e-08 5.65Z"
            fill="#70707C"
          />
        </svg>
        <div className="memberships__old-account">
          <Image
            src={avatarSrc.old}
            width={50}
            height={50}
            alt="old-avatar"
            onError={() => {
              setAvatarSrc({
                ...avatarSrc,
                old: `https://cdn.discordapp.com/embed/avatars/${
                  user.discriminator % 5
                }.png`
              })
            }}
          />
          <div>
            <h5>{`${user.name}#${String(user.discriminator).padStart(4, "0")}`}</h5>
            <p>({strings.membership_current_account})</p>
          </div>
        </div>
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={handleClose}>
          {strings.cancel}
        </button>
        <button className="btn btn-danger" onClick={transfer}>
          {strings.membership_verify}
        </button>
      </div>
    </div>
  )
}

export default function TransferDataModal({ openModal, setOpenModal }) {
  const handleCloseModal = () => setOpenModal(false)
  const { user } = React.useContext(Context)
  const [globalState, setGlobalState] = useState({
    oldId: '',
    name: '',
    discriminator: '',
    email: ''
  })

  const [step, setStep] = useState(0)
  const STEPS = [
    {
      title: strings.membership_transfer_modal_title,
      description: strings.membership_transfer_modal_description,
      component: OldAccount
    },
    {
      title: strings.membership_transfer_modal_verify,
      description: strings.formatString(strings.membership_transfer_modal_verify_description, globalState.email),
      component: VerifyAccount
    },
    {
      title: strings.membership_modal_confirmation_title,
      description: strings.formatString(
        strings.membership_modal_confirmation_description,
        `${globalState.name}#${globalState.discriminator}`,
        `${user.name}#${String(user.discriminator).padStart(4, "0")}`
      ),
      component: Confirmation
    }
  ]
  const currentStep = STEPS[step]

  return (
    <>
      <Modal
        isOpen={openModal}
        onRequestClose={handleCloseModal}
        className="smallModal bg-modal transfer-modal"
        parentSelector={() => document.getElementById('main')}
      >
        <div className="Modalhead">
          <div className="memberships__modal-head">
            <h5>{currentStep.title}</h5>
            <p>{currentStep.description}</p>
          </div>
        </div>
        {createElement(currentStep.component, {
          step,
          setStep,
          handleCloseModal,
          globalState,
          setGlobalState
        })}
      </Modal>
    </>
  )
}
