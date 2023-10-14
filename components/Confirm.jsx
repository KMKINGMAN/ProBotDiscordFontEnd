import Modal from 'react-modal'
import strings from '@script/locale'
import { useContext } from 'react'
import { Context } from '@script/_context'

export default function Confirm({
  title,
  text,
  show,
  onConfirm,
  onCancel,
  loading = false
}) {
  const { rtl } = useContext(Context)

  if (!show) return <></>

  return (
    <Modal
      isOpen={show}
      ariaHideApp={false}
      onRequestClose={onCancel}
      className={`smallModal bg-modal confirm-modal__content${
        rtl ? ' rtl' : ''
      }`}
      parentSelector={() => document.getElementById('main')}
    >
      <div className="confirm-modal">
        <div>
          <div className="Modalhead">
            <h3>{strings[title]}</h3>
            <button onClick={onCancel}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <p>{text}</p>
        </div>
        <div>
          <button onClick={onCancel}>{strings.never_mind}</button>
          <button onClick={onConfirm} disabled={loading}>
            {strings.delete}
            {loading && (
              <svg
                className="tw-animate-spin tw--ml-1 tw--mr-2 tw-h-4 tw-w-4 tw-text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="tw-opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="tw-opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
