import { useState, useContext, useCallback, useEffect } from 'react'
import strings from '@script/locale'
import PagesTitle from '@component/PagesTitle'
import Unsaved from '@component/unsaved'
import { Context } from '@script/_context'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import Dropdown from '@component/dropdown'
import { debounce, isEmpty } from 'lodash'
import axios from 'axios'
import { INITIAL_EMBED_DATA } from '@script/constants'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import EasyEmbed from '@component/EasyEmbed'
import Input from '@component/Input'

const SCHEMA = Yup.array().of(
  Yup.object().shape({
    name: Yup.string().required(strings.twitch_channel_name_required),
    channel: Yup.string().required(strings.twitch_channel_name_required),
    content: Yup.object().shape({
      type: Yup.string().oneOf(['message', 'embed']),
      content: Yup.string().when('type', {
        is: 'message',
        then: Yup.string().required(strings.required),
        otherwise: Yup.string().nullable()
      }),
      embed: Yup.object().when('type', {
        is: 'embed',
        then: Yup.object().shape({
          title: Yup.string().when(
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
              then: Yup.string().required(strings.required)
            }
          ),
          description: Yup.string().max(4096, 'Too Long!'),
          author: Yup.object().shape({
            name: Yup.string().max(256, 'Too Long!'),
            icon_url: Yup.string(),
            url: Yup.string().url(strings.embed_valid_url)
          }),
          footer: Yup.object().shape({
            text: Yup.string().max(2048, 'Too Long!'),
            icon_url: Yup.string()
          }),
          image: Yup.object().shape({
            url: Yup.string()
          }),
          thumbnail: Yup.object().shape({
            url: Yup.string()
          }),
          color: Yup.number(),
          fields: Yup.array().of(
            Yup.object().shape({
              name: Yup.string().max(256, 'Too Long!'),
              value: Yup.string().max(1024, 'Too Long!'),
              inline: Yup.boolean()
            })
          )
        }),
        otherwise: Yup.object().shape({
          title: Yup.string().max(256, 'Too Long!'),
          description: Yup.string().max(4096, 'Too Long!'),
          author: Yup.object().shape({
            name: Yup.string().max(256, 'Too Long!'),
            icon_url: Yup.string(),
            url: Yup.string().url(strings.embed_valid_url)
          }),
          footer: Yup.object().shape({
            text: Yup.string().max(2048, 'Too Long!'),
            icon_url: Yup.string()
          }),
          image: Yup.object().shape({
            url: Yup.string()
          }),
          thumbnail: Yup.object().shape({
            url: Yup.string()
          }),
          color: Yup.number(),
          fields: Yup.array().of(
            Yup.object().shape({
              name: Yup.string().max(256, 'Too Long!'),
              value: Yup.string().max(1024, 'Too Long!'),
              inline: Yup.boolean()
            })
          )
        })
      })
    })
  })
)

export default function Twitch() {
  const { guild, setGuild, setUnsaved, Toast } = useContext(Context)
  const [openRow, setOpenRow] = useState(0)
  const [inSearch, setInSearch] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const { values, errors, touched, handleSubmit, setValues } = useFormik({
    initialValues: guild.notifications_twitch,
    validationSchema: SCHEMA,
    onSubmit: async (values) => {
      try {
        await axios.put(`/guilds/${guild.id}/notifications_twitch`, values)

        // save guild
        // end save
        setGuild({ ...guild, notifications_twitch: values })
        setUnsaved(false)
      } catch (err) {
        if (err.response?.data) {
          return Toast.fire({
            icon: 'error',
            title: err.response.data.strings
              ? strings[err.response.data.strings[0]]
              : err.response.data.error
          })
        }

        Toast.fire({
          icon: 'error',
          title: 'Error while sending request'
        })
      }
    }
  })

  const search = useCallback(
    debounce((query, index) => {
      if (!query) return setInSearch([])
      setIsSearching(true)
      axios
        .get(`/search_twitch?q=${encodeURIComponent(query)}`)
        .then((res) => {
          setInSearch(res.data)
        })
        .finally(() => {
          setShowSearch(true)
          setIsSearching(false)
        })
    }, 800),
    []
  )

  console.log(errors, values, 'ssssssssssss')

  useEffect(() => {
    if (inSearch.length) handleDropdownClick(inSearch[0], openRow, true)
  }, [inSearch])

  const handleDropdownClick = (d, index, auto) => {
    let array = JSON.parse(JSON.stringify(values))
    if (auto && array[index].name?.toLowerCase() !== d.name?.toLowerCase())
      return
    array[index].id = d.id
    array[index].name = d.name

    setValues(array)
  }

  useEffect(() => {
    console.log('ERRORS', errors)
  }, [errors])

  return (
    <>
      <Unsaved
        method="notifications_twitch"
        state={values}
        setStates={(values) => {
          console.log('setting values', values)
          setValues(values)
        }}
        type="array"
        default={[]}
        formId="twitch-notifications-form"
      />
      <header>
        <div className="custom-page-title">
          <PagesTitle
            data={{
              name: 'twitch',
              module: `notifications_twitch`
            }}
          />
        </div>
        <div className="header-image twitch-image" />
      </header>
      <button
        type="button"
        className="btn btn-primary btn-icon"
        onClick={() => {
          if (values?.length > 0)
            return Toast.fire({
              icon: 'error',
              title: strings.twitch_only_1_beta
            })

          setValues([
            ...values,
            {
              name: '',
              channel: '',
              content: INITIAL_EMBED_DATA
            }
          ])
        }}
        style={{ zIndex: '2' }}
      >
        <i className="fas fa-plus"></i>
        {strings.add_channel}
      </button>

      <form
        id="twitch-notifications-form"
        className="row-container mt-25"
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit()
        }}
      >
        {values?.map((channel, index) => (
          <div className="notifications-row" key={index}>
            <div className="d-flex align-items-center flex-wrap gap-2">
              <header style={{ flex: '1 1 100px' }}>
                <h1 className="d-flex gap-2 align-items-center text-break">
                  <i className="fas fa-desktop-alt"></i>
                  {channel.name || strings.need_setup}
                </h1>
                {channel.channel && (
                  <p>
                    {
                      guild.channels.find((channel) =>
                        values[index].channel?.includes(channel.id)
                      )?.name
                    }
                  </p>
                )}
              </header>
              <div className="d-flex align-items-center gap-2">
                <button
                  onClick={() => {
                    openRow === index ? setOpenRow(false) : setOpenRow(index)
                  }}
                  className={`btn btn-primary btn-icon ${
                    openRow === index ? 'activeBtn' : ''
                  }`}
                >
                  <img src="/static/edit.svg" alt="edit-image" /> {strings.EDIT}
                </button>
                <button
                  onClick={() => {
                    setValues(values.filter((a, i) => i !== index))
                  }}
                  className="btn btn-danger btn-icon"
                >
                  <i className="fas fa-trash"></i> {strings.delete}
                </button>
              </div>
            </div>
            <div
              className={`edit-notifications-row${
                openRow === index ? ' edit-notifications-row__opened' : ''
              }`}
            >
              <div className="two-inputs-row">
                <div className="d-flex flex-column">
                  <label htmlFor={`notifications-username-${index}`}>
                    {strings.twitch_username}
                  </label>

                  <Dropdown
                    trigger={'click'}
                    visible={showSearch && inSearch?.length}
                    onOverlayClick={() => setShowSearch(false)}
                    onClickOutside={() => setShowSearch(false)}
                    onClick={() => setShowSearch(true)}
                    placement={'bottomCenter'}
                    overlay={
                      <div
                        className="dropdown__content"
                        style={{ height: '300px', overflow: 'scroll' }}
                      >
                        <ul>
                          {inSearch.map((d, i) => (
                            <li key={i}>
                              <div
                                className="d-flex p-2 pointer"
                                onClick={() => {
                                  handleDropdownClick(d, index)
                                }}
                              >
                                <img
                                  src={d.thumbnail_url}
                                  style={{
                                    width: '40px',
                                    borderRadius: '50%'
                                  }}
                                  className="actions-dropdown-avatar"
                                />
                                <span className="ms-2 mt-2">{d.name}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    }
                  >
                    <div className="search-twitch-name">
                      <Input
                        type="text"
                        value={values[index].name}
                        onChange={(event) => {
                          const array = JSON.parse(JSON.stringify(values))
                          array[index].name = event.target.value
                          array[index].id = undefined

                          setValues(array)
                          search(event.target.value, index)
                        }}
                        className="form-control mt-5"
                        placeholder={strings.Username}
                        id={`notifications-username-${index}`}
                        style={{
                          transition: 'all 0.3s ease',
                          ...(isSearching ? { paddingInlineEnd: '2.5rem' } : {})
                        }}
                        error={touched?.[index]?.name && errors?.[index]?.name}
                      />
                      {isSearching && (
                        <i className="fas fa-circle-notch fa-spin"></i>
                      )}
                    </div>
                  </Dropdown>
                </div>
                <div className="d-flex flex-column">
                  <label htmlFor="notifications-channel" className="mb-5">
                    {strings.twitch_send_to_channel}
                  </label>
                  <Select
                    placeholder={strings.select_placeholder_select}
                    classNamePrefix="formselect"
                    onChange={(value) => {
                      const array = JSON.parse(JSON.stringify(values))
                      array[index].channel = value.value
                      setValues(array)
                    }}
                    value={
                      guild.channels.find((channel) =>
                        values[index].channel?.includes(channel.id)
                      )
                        ? {
                            label:
                              '#' +
                              guild.channels.find((channel) =>
                                values[index].channel?.includes(channel.id)
                              ).name,
                            value: guild.channels.find((channel) =>
                              values[index].channel?.includes(channel.id)
                            ).id
                          }
                        : undefined
                    }
                    options={
                      guild.channels
                        ?.filter((c) => [0, 5].includes(c.type))
                        .map((channel) => ({
                          label: '#' + channel.name,
                          value: channel.id
                        })) || []
                    }
                    components={makeAnimated()}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      ...(touched?.[index]?.channel &&
                        errors?.[index]?.channel && {
                          control: (base) => ({
                            ...base,
                            borderColor: 'var(--red) !important'
                          })
                        })
                    }}
                  />
                </div>
              </div>
              <div className="d-flex flex-column mt-16 gap-1">
                <label htmlFor={`notifications-content-${index}`}>
                  {strings.twitch_content}
                </label>
                <EasyEmbed
                  errors={
                    !isEmpty(touched) && {
                      embed: errors[index]?.content?.embed,
                      content: errors[index]?.content?.content
                    }
                  }
                  value={values[index].content}
                  onChange={(content) => {
                    const array = JSON.parse(JSON.stringify(values))
                    array[index].content = content

                    setValues(array)
                  }}
                  textareaHint={
                    <>
                      <p>
                        <code>[stream.name]</code> {strings.twitch_name}
                      </p>
                      <p>
                        <code>[stream.link]</code> {strings.twitch_link}
                      </p>
                    </>
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </form>
    </>
  )
}
