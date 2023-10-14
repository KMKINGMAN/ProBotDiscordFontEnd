import { Context } from '@script/_context'
import { useContext } from 'react'
import strings from '@script/locale'
import { useFormik } from 'formik'
import { INITIAL_VALUES, VALIDATION_SCHEMA } from './constants'
import ButtonSettings from './ButtonSettings'
import SelectMenus from './SelectMenus'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalClose
} from '../../../components/ui/modal'

const generateRandomId = () => Math.floor(Math.random() * 1000000000)

export default function ResponseModal({
  isOpen,
  handleClose,
  setValues: setEmbedData,
  values: embedData,
  embedForEdit
}) {
  const { Toast } = useContext(Context)

  const { values, errors, touched, handleSubmit, setValues, resetForm } =
    useFormik({
      initialValues: embedForEdit || INITIAL_VALUES,
      validationSchema: VALIDATION_SCHEMA,
      onSubmit: async (data) => {
        try {
          if (embedForEdit) {
            setEmbedData({
              ...embedData,
              reactions: embedData?.reactions?.map((reaction) =>
                reaction.id === embedForEdit.id ? data : reaction
              )
            })
          } else {
            setEmbedData({
              ...embedData,
              reactions: [
                ...(embedData?.reactions || []),
                {
                  ...data,
                  id: generateRandomId()
                }
              ]
            })
          }
          resetForm()
          handleClose()
        } catch (error) {
          console.log(error)
          Toast.fire({
            icon: 'error',
            title: error?.response?.data?.message || 'Something went wrong'
          })
        }
      }
    })
  const setValue = (key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
      <ModalContent style={{ width: '1240px' }}>
        <ModalHeader>
          <ModalTitle>{strings.ADD_RESPONSE}</ModalTitle>
        </ModalHeader>
        <form
          id="responseForm"
          className="no-scroll tw-max-h-[70vh] tw-overflow-y-auto tw-overflow-x-hidden"
          onSubmit={handleSubmit}
        >
          <label className="control-label">Response type</label>
          <div className="toggle-buttons">
            {[
              { key: 'rr_select_menu', number: 3 },
              { key: 'rr_buttons', number: 2 }
            ].map((type) => (
              <button
                type="button"
                key={type.key}
                className={type.number === values.type ? 'active' : ''}
                onClick={() => {
                  setValue('type', type.number)
                }}
              >
                {strings[type.key]}
              </button>
            ))}
          </div>

          <div className="tw-mt-5">
            {values.type === 3 ? (
              <SelectMenus
                {...{ values, setValue: setValues, errors, touched }}
              />
            ) : (
              <ButtonSettings {...{ values, setValue, errors, touched }} />
            )}
          </div>
        </form>
        <ModalFooter>
          <ModalClose>
            <button
              onClick={handleClose}
              className="tw-btn-sec sm:tw-w-full"
              aria-label="Close"
              type={'button'}
            >
              {strings.cancel}
            </button>
          </ModalClose>
          <button
            type="submit"
            form="responseForm"
            className="tw-btn-primary sm:tw-w-full"
          >
            {embedForEdit ? 'Edit' : 'Add'} Response
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
