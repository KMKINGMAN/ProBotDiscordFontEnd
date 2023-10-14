import SingleRow from './SingleRow'
import styles from './styles.module.css'
import strings from '@script/locale'
import Input from '@component/Input'
import { INITIAL_EMBED_DATA } from '@script/constants'
import { useState } from 'react'
import Emoji from '@component/emoji-picker/Emoji'

const uniqueId = () => `rm_${Math.random().toString(36).substring(2, 10)}`

export default function SelectMenus({
  values,
  setValue,
  index = 0,
  touched,
  errors
}: {
  values: any
  setValue: any
  index?: number
  touched: any
  errors: any
}) {
  const [openedOptions, setOpenedOptions] = useState<number[]>([])
  if (!values) return <></>

  const BUTTON_CLOSE_OPTIONS_STYLE =
    'tw-display-flex tw-h-[28px] tw-w-[28px] tw-items-center tw-justify-center tw-border-none tw-rounded-full tw-border tw-bg-transparent tw-px-0.5 tw-text-sm tw-font-semibold tw-text-red-500 hover:tw-bg-red-500 hover:tw-bg-opacity-10'

  return (
    <div className={styles.container}>
      <label className="control-label" htmlFor={`optionLabel-${index}`}>
        {strings.rr_select_menu_placeholder}
      </label>
      <div className="tw-flex tw-items-start tw-gap-2">
        <div className="tw-flex-1">
          <Input
            id={`optionLabel-${index}`}
            className="form-control"
            type="text"
            value={values.placeholder}
            onChange={({ target: { value } }) => {
              if (!values.options.length) {
                setValue({
                  ...values,
                  options: [
                    { label: '', description: '', emoji: null, id: uniqueId() }
                  ]
                })
              }
              setValue({
                ...values,
                placeholder: value
              })
            }}
            placeholder={strings.type_here}
            error={
              (touched.placeholder && errors.placeholder) ||
              (touched.options &&
                typeof errors.options === 'string' &&
                errors.options)
            }
          />
        </div>
        <div className="tw-flex-3">
          <button
            type="button"
            id={`rr_emoji-${index}`}
            className="btn btn-icon btn-primary tw-h-[42px]"
            disabled={values.options.length >= 25}
            onClick={() => {
              if (values.options.length >= 25) return
              setValue({
                ...values,
                options: [
                  ...values.options,
                  {
                    label: '',
                    description: '',
                    emoji: null,
                    id: uniqueId(),
                    response: INITIAL_EMBED_DATA
                  }
                ]
              })
            }}
          >
            <i className="fas fa-plus"></i>
            <span className={'tw-md:hidden tw-ml-2 tw-inline'}>
              {strings.rr_add_option}
            </span>
          </button>
        </div>
      </div>
      <div className="tw-flex tw-flex-col tw-gap-2">
        <span className="tw-mb-2 tw-text-xs tw-text-gray-500">
          <i className="fas fa-info-circle tw-mr-1"></i>

          {strings.formatString(
            strings.select_menu_limit_message,
            <span className="tw-font-bold">{values.options.length}</span>
          ) || (
            <>
              the max number of options is 25. you have{' '}
              <span className="tw-font-bold">{values.options.length}</span>{' '}
              options
            </>
          )}
        </span>
        {values.options.map((selectMenu, selectMenuIndex) =>
          openedOptions.includes(selectMenuIndex) ? (
            <div
              className={`tw-rounded-md ${
                selectMenuIndex === values.options.length - 1
                  ? ' tw-border-t'
                  : ''
              }`}
            >
              <div
                key={`item-${selectMenuIndex}`}
                className={`tw-flex tw-cursor-pointer tw-items-center tw-gap-2 tw-rounded-lg tw-rounded-ee-none tw-rounded-es-none tw-bg-grey-3 tw-p-3`}
                onClick={() => {
                  setOpenedOptions((prev) =>
                    prev.filter((i) => i !== selectMenuIndex)
                  )
                }}
              >
                <div className="tw-flex tw-flex-1 tw-items-center tw-gap-3">
                  <Emoji
                    emoji={selectMenu.emoji}
                    size={'1.8rem'}
                    className="flex"
                    onClick={undefined}
                    onMouseEnter={undefined}
                  />
                  <div>
                    <label
                      className="control-label tw-m-0 tw-font-semibold tw-text-gray-100"
                      htmlFor={`option-label-${values.index}`}
                    >
                      {selectMenu.label || strings.rr_option_title}
                    </label>
                    <p className="tw-m-0 tw-text-sm tw-font-semibold tw-text-gray-500">
                      {selectMenu.description || strings.rr_option_description}
                    </p>
                  </div>
                </div>
                <div className="tw-flex-3">
                  <button
                    type="button"
                    className={BUTTON_CLOSE_OPTIONS_STYLE}
                    onClick={() => {
                      setOpenedOptions((prev) =>
                        prev.filter((i) => i !== selectMenuIndex)
                      )
                    }}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              </div>
              <SingleRow
                key={`item-${selectMenuIndex}`}
                values={{
                  ...selectMenu,
                  index: selectMenuIndex
                }}
                setValue={(key: string, value: any) => {
                  setValue({
                    ...values,
                    options: values.options.map((option, i) =>
                      i === selectMenuIndex
                        ? { ...option, [key]: value }
                        : option
                    )
                  })
                }}
                index={index}
                removeSelectMenuOption={() => {
                  setValue({
                    ...values,
                    options: values.options.filter(
                      (_, i) => i !== selectMenuIndex
                    )
                  })
                }}
                touched={touched?.options?.[selectMenuIndex]}
                errors={errors?.options?.[selectMenuIndex]}
              />
            </div>
          ) : (
            <div
              key={`item-${selectMenuIndex}`}
              className={`tw-flex tw-cursor-pointer tw-items-center tw-gap-2 tw-rounded-lg tw-bg-grey-3 tw-p-3`}
              onClick={() => {
                setOpenedOptions((prev) => [...prev, selectMenuIndex])
              }}
            >
              <div className="tw-flex tw-flex-1 tw-items-center tw-gap-3">
                <Emoji
                  emoji={selectMenu.emoji}
                  size={'1.8rem'}
                  className="flex"
                  onClick={undefined}
                  onMouseEnter={undefined}
                />
                <div>
                  <label
                    className="control-label tw-m-0 tw-font-semibold tw-text-gray-100"
                    htmlFor={`option-label-${values.index}`}
                  >
                    {selectMenu.label || strings.rr_option_title}
                  </label>
                  <p className="tw-m-0 tw-text-sm tw-font-semibold tw-text-gray-500">
                    {selectMenu.description || strings.rr_option_description}
                  </p>
                </div>
              </div>
              <div className="tw-flex-3">
                <button
                  type="button"
                  className={BUTTON_CLOSE_OPTIONS_STYLE}
                  onClick={() => {
                    setValue({
                      ...values,
                      options: values.options.filter(
                        (_, i) => i !== selectMenuIndex
                      )
                    })
                  }}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
