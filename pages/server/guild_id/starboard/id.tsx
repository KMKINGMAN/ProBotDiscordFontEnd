import Input from '@component/Input'
import { Context } from '@script/_context'
import { useFormik } from 'formik'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import strings from '@script/locale'
import EmojiPicker from '@component/emoji-picker'
import Select from 'react-select'
import Switch from 'react-switch'
import {
  CHANNELS_STYLES,
  INITIAL_EMBED_DATA,
  ROLES_STYLES
} from '@script/constants'
import { CountingComponent } from '@component/fields'
import Emoji from '@component/emoji-picker/Emoji'
import SelectChannels from '@component/SelectChannels'
import EasyEmbed from '@component/EasyEmbed'
import * as yup from 'yup'
import { isEmpty } from 'lodash'
import axios from 'axios'

const schema = yup.object().shape({
  name: yup.string().required('Required'),
  channel: yup.string().required('Required'),
  allowed_roles: yup.array().of(yup.string()),
  allowed_channels: yup.array().of(yup.string()),
  reaction_count: yup.number().required('Required'),
  content: yup.object().shape({
    type: yup.string().oneOf(['message', 'embed']),
    content: yup.string().when('type', {
      is: 'message',
      then: yup.string().required(strings.required),
      otherwise: yup.string().nullable()
    }),
    embed: yup.object().when('type', {
      is: 'embed',
      then: yup.object().shape({
        title: yup
          .string()
          .when(
            ['description', 'author', 'footer', 'image', 'thumbnail', 'fields'],
            {
              is: (description, author, footer, image, thumbnail, fields) =>
                !description &&
                !author?.name &&
                !author?.icon_url &&
                !author?.url &&
                !footer?.text &&
                !footer?.icon_url &&
                !image?.url &&
                !thumbnail?.url &&
                !fields?.length,
              then: yup.string().required(strings.required)
            }
          ),
        description: yup.string().max(4096, 'Too Long!'),
        author: yup.object().shape({
          name: yup.string().max(256, 'Too Long!'),
          icon_url: yup.string(),
          url: yup.string().url(strings.embed_valid_url)
        }),
        footer: yup.object().shape({
          text: yup.string().max(2048, 'Too Long!'),
          icon_url: yup.string()
        }),
        image: yup.object().shape({
          url: yup.string()
        }),
        thumbnail: yup.object().shape({
          url: yup.string()
        }),
        color: yup.number(),
        fields: yup.array().of(
          yup.object().shape({
            name: yup.string().max(256, 'Too Long!'),
            value: yup.string().max(1024, 'Too Long!'),
            inline: yup.boolean()
          })
        )
      }),
      otherwise: yup.object().shape({
        title: yup.string().max(256, 'Too Long!'),
        description: yup.string().max(4096, 'Too Long!'),
        author: yup.object().shape({
          name: yup.string().max(256, 'Too Long!'),
          icon_url: yup.string(),
          url: yup.string().url(strings.embed_valid_url)
        }),
        footer: yup.object().shape({
          text: yup.string().max(2048, 'Too Long!'),
          icon_url: yup.string()
        }),
        image: yup.object().shape({
          url: yup.string()
        }),
        thumbnail: yup.object().shape({
          url: yup.string()
        }),
        color: yup.number(),
        fields: yup.array().of(
          yup.object().shape({
            name: yup.string().max(256, 'Too Long!'),
            value: yup.string().max(1024, 'Too Long!'),
            inline: yup.boolean()
          })
        )
      })
    })
  }),
  emoji: yup.object().nullable(),
  react_to_starboard: yup.boolean().required('Required'),
  ignore_self_reaction: yup.boolean().required('Required')
})

const starEmoji = {
  asset: null,
  category: 'nature',
  id: 'star',
  name: 'star',
  native: '⭐'
}

export default function StarboardItem() {
  const router = useRouter()
  const { guild, Toast } = useContext(Context)
  const [saving, setSaving] = useState(false)
  const currentStarboard = guild.starboard.find(
    (board) => board.id === router.query.id
  )

  const { values, dirty, errors, touched, setValues, handleSubmit } = useFormik(
    {
      initialValues: {
        ...currentStarboard,
        emoji:
          typeof currentStarboard.emoji === 'string'
            ? JSON.parse(currentStarboard.emoji)
            : currentStarboard.emoji,
        channel: currentStarboard.channel || '',
        reaction_count: currentStarboard?.reaction_count || 3,
        content: {
          ...INITIAL_EMBED_DATA,
          ...(typeof currentStarboard.content === 'string'
            ? JSON.parse(currentStarboard.content)
            : currentStarboard.content)
        }
      },
      validationSchema: schema,
      onSubmit: async (values) => {
        setSaving(true)
        try {
          await axios.put(
            `/guilds/${guild.id}/starboard/${router.query.id}`,
            values
          )

          Toast.fire({
            icon: 'success',
            title: 'Starboard updated successfully'
          })
        } catch (error) {
          Toast.fire({
            icon: 'error',
            title: error?.response?.data?.message || 'Something went wrong'
          })
        } finally {
          setSaving(false)
        }
      }
    }
  )

  const [open, setOpen] = useState<number[]>([1, 2, 3])
  const handleOpen = (value: number) => {
    const index = open.indexOf(value)
    if (index > -1) {
      const newOpen = [...open]
      newOpen.splice(index, 1)
      setOpen(newOpen)
      return
    }
    setOpen([...open, value])
  }

  return (
    <>
      <div>
        <div className="tw-mb-[35px] tw-mt-[10px] tw-flex tw-justify-start tw-border tw-border-x-0 tw-border-t-0 tw-border-solid tw-border-grey-2 tw-pb-[20px]">
          <Link href={`/server/${guild.id}/starboard`}>
            <div className="tw-flex tw-cursor-pointer tw-items-center">
              <svg
                width="30"
                height="32"
                viewBox="0 0 30 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5416 22.6L11.1083 17.1667C10.4666 16.525 10.4666 15.475 11.1083 14.8334L16.5416 9.40002"
                  stroke="#70707C"
                  stroke-width="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span className="tw-text-xl">{strings.starboard_create}</span>
            </div>
          </Link>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSubmit()
          }}
          className="tw-flex tw-flex-col tw-gap-4"
        >
          {dirty && (
            <button
              type="submit"
              className={`tw-btn-primary tw-btn-icon tw-w-max${
                saving ? ' tw-disabled tw-opacity-50' : ''
              }`}
            >
              <span>{strings.save}</span>
            </button>
          )}
          <div className="tw-rounded-lg tw-bg-grey-4 tw-px-[20px] tw-py-[24px]">
            <div
              className={`tw-flex tw-items-center tw-justify-between tw-border-0`}
            >
              <span
                onClick={() => handleOpen(1)}
                className="tw-cursor-pointer tw-text-sm"
              >
                {strings.starboard_configuration}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="tw-h-5 tw-w-5 tw-cursor-pointer tw-transition-transform"
                style={{
                  transform: `rotate(${open.includes(1) ? '180deg' : '0deg'})`
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                onClick={() => handleOpen(1)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {open.includes(1) && (
              <div className="tw-mt-[20px]">
                <hr className="tw-my-[20px] tw-border-x-0 tw-border-t-0 tw-border-solid tw-bg-grey-1" />
                <div className="tw-double-input tw-gap-4">
                  <div className="tw-align-center tw-flex tw-w-full tw-justify-between tw-gap-5 sm:tw-flex-col">
                    <div className="tw-w-[50%] sm:tw-w-full">
                      <label className="control-label" htmlFor="name">
                        {strings.starboard_name}
                      </label>
                      <Input
                        wrapperClassName="flex-1"
                        type="text"
                        placeholder="Starboard name"
                        name="name"
                        value={values.name}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => setValues({ ...values, name: event.target.value })}
                        error={touched.name && errors.name}
                      />
                    </div>
                    <div className="tw-w-[50%] sm:tw-w-full">
                      <label className="control-label" htmlFor="name">
                        {strings.ENABLED_CHANNELS}
                      </label>
                      <SelectChannels
                        handleChange={(selectValues: any) => {
                          setValues({
                            ...values,
                            allowed_channels: selectValues.map((ch) => ch.value)
                          })
                        }}
                        handleRemove={(target) => {
                          setValues({
                            ...values,
                            allowed_channels: values.allowed_channels.filter(
                              (ch) => ch !== target.value
                            )
                          })
                        }}
                        isMulti
                        selectedValue={
                          guild.channels &&
                          guild.channels
                            .filter(
                              (channel) =>
                                [0, 4, 5]?.includes(channel.type) &&
                                values.allowed_channels?.includes(channel.id)
                            )
                            .map((channel) => ({
                              ...channel,
                              label: channel.name,
                              value: channel.id
                            }))
                        }
                        errorMessage={
                          touched.allowed_channels &&
                          (errors.allowed_channels as string)
                        }
                        placeholder="Select channels"
                      />
                    </div>
                  </div>
                  <div className="tw-align-center tw-flex tw-w-full tw-justify-between tw-gap-5 sm:tw-flex-col">
                    <div className="tw-w-[50%] sm:tw-w-full">
                      <label className="control-label" htmlFor="name">
                        {strings.channel}
                      </label>
                      <Select
                        onChange={(val: { value: string }) =>
                          setValues({ ...values, channel: val.value })
                        }
                        value={
                          guild.channels &&
                          guild.channels
                            .filter((channel) => channel.id === values.channel)
                            ?.map((channel) => ({
                              label: channel.name,
                              value: channel.id
                            }))[0]
                        }
                        classNamePrefix="formselect"
                        options={
                          guild.channels &&
                          guild.channels
                            .filter((channel) => [0, 5]?.includes(channel.type))
                            .map((channel) => ({
                              label: channel.name,
                              value: channel.id
                            }))
                        }
                        placeholder={strings.select_placeholder_select}
                        styles={CHANNELS_STYLES}
                        noOptionsMessage={() => strings.no_option}
                      />
                      {touched.channel && errors.channel && (
                        <p className="tw-mt-1 tw-text-xs tw-text-red-main">
                          {errors.channel as string}
                        </p>
                      )}
                    </div>
                    <div className="tw-w-[50%] sm:tw-w-full">
                      <label className="control-label" htmlFor="name">
                        {strings.ENABLED_ROLES}
                      </label>
                      <Select
                        value={
                          guild.roles &&
                          guild.roles
                            .filter(
                              (role) =>
                                values.allowed_roles?.includes(role.id) &&
                                role.id !== guild.id &&
                                !role.managed
                            )
                            .map((role) => ({
                              ...role,
                              label: role.name,
                              value: role.id
                            }))
                        }
                        options={guild?.roles
                          .filter(
                            (role) => role.id !== guild?.id && !role.managed
                          )
                          .map((role) => ({
                            label: role.name,
                            value: role.id,
                            color: role.color
                          }))}
                        onChange={(val: any[]) =>
                          setValues({
                            ...values,
                            allowed_roles: val.map((ch) => ch.value)
                          })
                        }
                        isMulti
                        classNamePrefix="formselect"
                        styles={ROLES_STYLES}
                        placeholder={strings.select_placeholder_select}
                        noOptionsMessage={() => strings.no_option}
                      />
                      {touched.allowed_roles && errors.allowed_roles && (
                        <p className="tw-mt-1 tw-text-xs tw-text-red-main">
                          {errors.allowed_roles as string}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="tw-w-[49%] sm:tw-w-full">
                    <label className="control-label" htmlFor="count">
                      {strings.starboard_stars_limit}
                    </label>
                    <CountingComponent
                      // @ts-ignore
                      type="number"
                      id="link_age"
                      min={1}
                      max={99999}
                      name="link_age"
                      className="form-control input-lg full-width"
                      value={values.reaction_count}
                      onChange={(value) =>
                        setValues({ ...values, reaction_count: Number(value) })
                      }
                    />
                  </div>
                  <div className="tw-flex tw-w-[49%] tw-flex-col sm:tw-w-full">
                    <label className="control-label tw-flex">
                      {strings.starboard_custom_emoji}{' '}
                      <span className="vip-component-tag no-cursor">
                        Premium tier 2
                      </span>
                    </label>
                    <div className="tw-relative">
                      {guild.tier === 2 ? (
                        // @ts-ignore
                        <EmojiPicker
                          onClick={(emoji) => {
                            setValues({ ...values, emoji })
                          }}
                          customEmojiPickerContainerClassName="tw-block"
                        >
                          {values.emoji ? (
                            // @ts-ignore
                            <Emoji
                              emoji={values.emoji}
                              size={'1.5rem'}
                              className="button__select__emoji tw-w-max tw-rounded-lg tw-p-1 tw-text-2xl"
                            />
                          ) : (
                            <button
                              type="button"
                              className="button__select__emoji tw-w-max tw-rounded-lg tw-p-1 tw-text-2xl"
                            >
                              {/* @ts-ignore */}
                              <Emoji emoji={starEmoji} />
                            </button>
                          )}
                        </EmojiPicker>
                      ) : (
                        <button
                          type="button"
                          className="button__select__emoji tw-w-max tw-rounded-lg tw-p-1 tw-text-2xl"
                          disabled={true}
                        >
                          {/* @ts-ignore */}
                          {values.emoji ? (
                            // @ts-ignore
                            <Emoji emoji={values.emoji} />
                          ) : (
                            // @ts-ignore
                            <Emoji emoji={starEmoji} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="tw-rounded-lg tw-bg-grey-4 tw-px-[20px] tw-py-[24px]">
            <div
              className={`tw-flex tw-items-center tw-justify-between tw-border-0`}
            >
              <span
                onClick={() => handleOpen(2)}
                className="tw-cursor-pointer tw-text-sm"
              >
                {strings.starboard_message}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="tw-h-5 tw-w-5 tw-cursor-pointer tw-transition-transform"
                style={{
                  transform: `rotate(${open.includes(2) ? '180deg' : '0deg'})`
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                onClick={() => handleOpen(2)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {open.includes(2) && (
              <div className="tw-mt-[20px]">
                <hr className="tw-my-[20px] tw-border-x-0 tw-border-b-0 tw-border-t-0 tw-border-solid tw-bg-grey-1" />
                <EasyEmbed
                  containerClassNames="tw-p-0 tw-bg-transparent"
                  errors={
                    !isEmpty(touched) && {
                      // @ts-ignore
                      embed: errors?.content?.embed,
                      // @ts-ignore
                      content: errors?.content?.content
                    }
                  }
                  value={values.content}
                  onChange={(content) => {
                    // console.log(content)
                    setValues({ ...values, content })
                  }}
                  // @ts-ignore
                  textareaHint={
                    <div className="tw-flex tw-flex-col tw-gap-2 tw-font-medium tw-cursor-none tw-text-grey-text3">
                      <span className="tw-cursor-pointer tw-text-sm ">
                        <code>[author]</code>
                        {strings.starboard_author_variable}
                      </span>
                      <span className="tw-cursor-pointer tw-text-sm">
                        <code>[stars]</code>
                        {strings.starboard_stars_variable}
                      </span>
                      <span className="tw-cursor-pointer tw-text-sm">
                        <code>[channel]</code>
                        {strings.starboard_channel_variable}
                      </span>
                      <span className="tw-cursor-pointer tw-text-sm">
                        <code>[link]</code>
                        {strings.starboard_link_variable}
                      </span>
                      <span className="tw-cursor-pointer tw-text-sm">
                        <code>[content]</code>
                        {strings.starboard_content_variable}
                      </span>
                      <span className="tw-cursor-pointer tw-text-sm">
                        <code>[emoji]</code>
                        {strings.starboard_emoji_variable}
                      </span>
                    </div>
                  }
                />
              </div>
            )}
          </div>
          <div className="tw-rounded-lg tw-bg-grey-4 tw-px-[20px] tw-py-[24px]">
            <div
              className={`tw-flex tw-items-center tw-justify-between tw-border-0`}
            >
              <span
                onClick={() => handleOpen(3)}
                className="tw-cursor-pointer tw-text-sm"
              >
                {strings.advanced_settings}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="tw-h-5 tw-w-5 tw-cursor-pointer tw-transition-transform"
                style={{
                  transform: `rotate(${open.includes(3) ? '180deg' : '0deg'})`
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                onClick={() => handleOpen(3)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {open.includes(3) && (
              <div className="tw-mt-[20px]">
                <hr className="tw-my-[20px] tw-border-x-0 tw-border-b-0 tw-border-t-0 tw-border-solid tw-bg-grey-1" />
                <div className="tw-flex tw-flex-col tw-gap-3">
                  <div className="tw-align-center tw-flex tw-w-full tw-justify-between tw-gap-5">
                    <label className="control-label tw-mt-2 tw-text-[16px] tw-normal-case">
                      {strings.starboard_ignore_self}
                    </label>
                    <Switch
                      onChange={(value) =>
                        setValues({ ...values, ignore_self_reaction: value })
                      }
                      checked={values.ignore_self_reaction || false}
                      onColor="#5865F2"
                      handleDiameter={27}
                      height={30}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      aria-label="reaction role"
                      width={60}
                      className="dramexSwi"
                    />
                  </div>
                  <div className="tw-align-center tw-flex tw-w-full tw-justify-between tw-gap-5">
                    <label className="control-label tw-mt-2 tw-text-[16px] tw-normal-case">
                      {strings.starboard_react_to_post}
                    </label>
                    <Switch
                      onChange={(value) => {
                        setValues({ ...values, react_to_starboard: value })
                      }}
                      checked={values.react_to_starboard || false}
                      onColor="#5865F2"
                      handleDiameter={27}
                      height={30}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      aria-label="reaction role"
                      width={60}
                      className="dramexSwi"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  )
}
