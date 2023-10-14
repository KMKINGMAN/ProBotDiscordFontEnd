import EmojiPicker from '@component/emoji-picker'
import styles from './styles.module.css'
import Emoji from '@component/emoji-picker/Emoji'
import strings from '@script/locale'
import { DISCORD_BUTTONS_COLORS } from '@script/constants'
import Input from '@component/Input'
import EasyEmbed from '@component/EasyEmbed'
import { isEmpty } from 'lodash'

export default function ButtonSettings({ values, setValue, errors, touched }) {
  return (
    <>
      <div className={styles.edit_body}>
        <div style={{ flex: '1 1 200px' }}>
          <label className="control-label" htmlFor="button-emoji-and-text">
            {strings.rr_button_description}
          </label>
          <div className="d-flex gap-2 align-items-start">
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
              {/* @ts-ignore */}
              <EmojiPicker
                onClick={(emoji) => {
                  setValue('emoji', emoji)
                }}
                childrenClassName={styles['emoji-picker-children']}
                emojiPickerContainerClassName={styles['emoji-picker-container']}
              >
                {values.emoji ? (
                  <div className={styles.selected_emoji}>
                    {/* @ts-ignore */}
                    <Emoji
                      emoji={values.emoji}
                      size={'1.4rem'}
                      className="flex"
                    />
                  </div>
                ) : (
                  <button type="button" className={styles.add_emoji_button}>
                    <i className="fas fa-plus"></i>
                  </button>
                )}
              </EmojiPicker>
            </div>
            <Input
              wrapperStyle={{ flex: '1 1 100%' }}
              error={touched?.label && errors?.label}
              className="form-control"
              type="text"
              id="button-emoji-and-text"
              placeholder={strings.Text}
              value={values.label}
              maxLength={80}
              onChange={(value) =>
                setValue('label', value.target.value.slice(0, 80))
              }
            />
          </div>
        </div>
        <div className={styles.edit_colors}>
          <label className="control-label">{strings.color}</label>
          <div>
            {DISCORD_BUTTONS_COLORS.map(({ color, name, value }) => (
              <button
                type="button"
                title={name}
                onClick={() =>
                  setValue('style', values.style === value ? null : value)
                }
                style={{ borderColor: color }}
                className={
                  values.style === value ? styles.button_color__active : ''
                }
              >
                <span
                  style={{
                    backgroundColor: color
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="tw-mt-5">
        <EasyEmbed
          errors={!isEmpty(touched?.response) && errors?.response}
          value={values.response}
          onChange={(content) => {
            setValue('response', content)
          }}
          containerClassNames="tw-bg-transparent tw-p-0"
        />
      </div>
    </>
  )
}
