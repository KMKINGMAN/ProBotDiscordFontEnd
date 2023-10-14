import strings from '@script/locale'
import EmojiPicker from '@component/emoji-picker'
import Emoji from '@component/emoji-picker/Emoji'

import styles from './styles.module.css'
import Input from '@component/Input'
import EasyEmbed from '@component/EasyEmbed'
import { isEmpty } from 'lodash'

export default function SingleRow(props) {
  const { values, setValue, removeSelectMenuOption, errors, touched } = props

  return (
    <div className={styles.singleRow__container}>
      <div className={styles.header}>
        <div>
          <div className={styles['singleRow__label-description-roles']}>
            <div className={styles['singleRow__label-description']}>
              <div className="tw-flex tw-flex-1 tw-gap-3">
                <div className={styles['emoji-picker__container']}>
                  <label className="control-label">{strings.emoji}</label>
                  <div className={styles['emoji-picker']}>
                    {values.emoji && (
                      <button
                        type="button"
                        className={styles.remove_emoji}
                        onClick={() => setValue('emoji', null)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                    <EmojiPicker
                      onClick={(emoji) => setValue('emoji', emoji)}
                      childrenClassName={styles['emoji-picker-children']}
                      emojiPickerContainerClassName={
                        styles['emoji-picker-container']
                      }
                    >
                      {values.emoji ? (
                        <div className={styles.selected_emoji}>
                          <Emoji
                            emoji={values.emoji}
                            size={'1.4rem'}
                            className="flex"
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          className={styles.add_emoji_button}
                        >
                          <i class="fas fa-plus"></i>
                        </button>
                      )}
                    </EmojiPicker>
                  </div>
                </div>
                <div>
                  <label
                    className="control-label"
                    htmlFor={`option-label-${values.index}`}
                  >
                    {strings.label}
                  </label>
                  <Input
                    className="form-control"
                    id={`option-label-${values.index}`}
                    placeholder={strings.rr_option_title}
                    value={values.label}
                    onChange={({ target: { value } }) =>
                      setValue('label', value)
                    }
                    error={touched?.label && errors?.label}
                  />
                </div>
              </div>
              <div className="tw-flex-1">
                <label
                  className="control-label"
                  htmlFor={`option-description-${values.index}`}
                >
                  {strings.rr_select_menu_description}
                </label>
                <input
                  id={`option-description-${values.index}`}
                  type="text"
                  className="form-control"
                  placeholder={strings.rr_option_description}
                  value={values.description}
                  maxLength={100}
                  onChange={({ target: { value } }) =>
                    setValue('description', value)
                  }
                />
              </div>
            </div>
          </div>
          <div className={styles.singleRow__actions}>
            <button
              type="button"
              onClick={() => removeSelectMenuOption()}
              className="btn btn-danger btn-icon"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
          <hr className="tw-my-[20px] tw-border-x-0 tw-border-t-0 tw-border-solid tw-bg-grey-1" />
          <div className="tw-mt-5 tw-w-full">
            <EasyEmbed
              errors={!isEmpty(touched?.response) && errors?.response}
              value={values.response}
              onChange={(content) => {
                setValue('response', content)
              }}
              containerClassNames="tw-bg-transparent tw-p-0"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
