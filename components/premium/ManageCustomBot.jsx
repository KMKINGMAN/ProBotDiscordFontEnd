import { useState, useContext, useRef, useEffect } from 'react'
import isEqual from 'lodash/isEqual'
import { Context } from '@script/_context'
import axios from 'axios'
import strings from '../../scripts/locale'
import Select from 'react-select'
import StatusIcon from './StatusIcon'

export default function ManageCustomBot({ s, setSub }) {
  const { guild, user, Toast } = useContext(Context)
  const avatarRef = useRef(null)

  const ACTIVITY_STATUS_LIST = [
    {
      value: 'online',
      label: strings.premium_status_online,
      icon: <StatusIcon color="#42FFA7" height="22" width="22" />
    },
    {
      value: 'idle',
      label: strings.premium_status_idle,
      icon: <StatusIcon color="#F29F3E" height="22" width="22" />
    },
    {
      value: 'dnd',
      label: strings.premium_status_dnd,
      icon: <StatusIcon color="#ED4C5C" height="22" width="22" />
    }
  ]

  const initManageState = {
    name: s.name || '',
    status: {
      name: s.status?.name || '',
      type: s.status?.type || 0,
      url: s.status?.url || '',
      presence: s.status?.presence || ACTIVITY_STATUS_LIST[0].value
    },
    newAvatar: ''
  }

  const [manage, setManage] = useState(initManageState)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!manage.newAvatar) avatarRef.current.value = ''
  }, [manage])

  const uploadAvatar = (event) => {
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('id', 2)
    formData.append('type', 'premium')
    formData.append('module', 'avatar')

    const progress = (percentCompleted) => {
      setProgress(percentCompleted)
    }
    setProgress(1)
    axios
      .post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: function (progressEvent) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          progress(percentCompleted)
        }
      })
      .then((response) => {
        setProgress(0)
        setManage({ ...manage, newAvatar: response.data.success })
      })
      .catch((error) => {
        setProgress(0)
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          const d = error.response.data
          if (strings[`error_upload_${d.error}`]) {
            return Toast.fire({
              icon: 'error',
              title: strings[`error_upload_${d.error}`]
            })
          }
          if (d.message) {
            return Toast.fire({
              icon: 'error',
              title: d.message
            })
          }
        }
        Toast.fire({
          icon: 'error',
          title: 'Error, try again later.'
        })

        console.log(error)
      })
  }

  const handleSubmit = () => {
    if (manage.name?.length > 32 || manage.name?.length < 2)
      return Toast.fire({ icon: "error", title: strings.premium_name_limit })
    if (
      !/^(|[a-zA-Z0-9_]{4,25})$/.test(
        // checks if the input consists of only letters, numbers, underscores, and has a length of 4 to 25 characters, which is a reasonable validation rule for a twitch username
        manage.status.url.replace("https://www.twitch.tv/", "")
      )
    )
      return Toast.fire({ icon: "error", title: "The username you entered is not valid. Please try again." })

    axios
      .post('/edit_premium', { ...manage, n: s.n, ...(guild.id ? { serverId: guild.id } : {}) })
      .then(() => {
        Toast.fire({
          icon: 'success',
          title: strings.success
        })
        setSub({ ...s, ...manage, avatar: manage.avatar || s.avatar })
      })
      .catch((err) => {
        Toast.fire({
          icon: 'error',
          title: err.response?.data?.error || 'Error while sending the request'
        })
      })
  }

  return (
    <div>
      <div className="row mt-30 border-top pb-3 p-2 pt-0">
        <h6 className="mt-20 text-uppercase section__premium__title">
          {strings.premium_bot_customization}
        </h6>
        <div
          className="col mt-10 d-flex gap-3 flex-1"
          style={{ minWidth: '300px' }}
        >
          <div className="full-width">
            <div className="d-flex flex-1 gap-2">
              <div className="update-subscription-avatar">
                <label htmlFor="update-avatar">
                  {!!progress && (
                    <svg className="progress-ring" width="50" height="50">
                      <circle
                        className="progress-ring__circle"
                        stroke="#2cb274"
                        strokeWidth="4"
                        fill="transparent"
                        r="23"
                        cx="25"
                        cy="25"
                        strokeDasharray={`${progress} ${
                          progress * 2 * Math.PI
                        }`}
                      />
                    </svg>
                  )}
                  <div className="status__icon">
                    {manage.status.presence === 'online' && (
                      <StatusIcon color="#42FFA7" height="32" width="32" />
                    )}
                    {manage.status.presence === 'dnd' && (
                      <StatusIcon color="#ED4C5C" height="32" width="32" />
                    )}
                    {manage.status.presence === 'idle' && (
                      <StatusIcon color="#F29F3E" height="32" width="32" />
                    )}
                  </div>
                  <img
                    className="subscription-avatar"
                    src={
                      manage.newAvatar ||
                      s.avatar ||
                      'https://cdn.discordapp.com/embed/avatars/0.png'
                    }
                    alt="subscription-avatar"
                  />
                  <span>{strings.premium_change_avatar}</span>
                  <i class="far fa-image"></i>
                </label>
                <input
                  hidden
                  type="file"
                  name="update-avatar"
                  id="update-avatar"
                  onChange={uploadAvatar}
                  accept="image/*"
                  ref={avatarRef}
                />
              </div>
              <div className="w-100">
                <label htmlFor="premium_bot_username" className="control-label">
                  {strings.premium_bot_username}
                </label>
                <input
                  id="premium_bot_username"
                  name="premium_bot_username"
                  className="form-control w-100"
                  placeholder={strings.premium_bot_username}
                  type="text"
                  value={manage.name}
                  onChange={(e) =>
                    setManage({ ...manage, name: e.target.value })
                  }
                  autoComplete="off"
                />
                <label className="control-label mt-15">
                  {strings.premium_bot_status}
                </label>
                <Select
                  classNamePrefix="formselect"
                  options={ACTIVITY_STATUS_LIST}
                  onChange={(e) =>
                    setManage({
                      ...manage,
                      status: {
                        ...manage.status,
                        presence: e.value
                      }
                    })
                  }
                  value={ACTIVITY_STATUS_LIST.find(
                    (e) => e.value === manage.status?.presence
                  )}
                  isSearchable={false}
                  placeholder={strings.select_placeholder_select}
                  noOptionsMessage={() => strings.no_option}
                  getOptionLabel={(e) => (
                    <div className="d-flex align-items-center">
                      <div className="d-flex align-items-center justify-content-center">
                        {e.icon}
                      </div>
                      <span className="select__label">{e.label}</span>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col mt-10 flex-1" style={{ minWidth: '300px' }}>
          <label htmlFor="premium_bot_status" className="control-label">
            {strings.premium_bot_activity}
          </label>
          <div>
            <select
              value={Number(manage.status.type)}
              id="premium_bot_status_type"
              className="form-control form-select"
              onChange={(e) =>
                setManage({
                  ...manage,
                  status: {
                    ...manage.status,
                    type: Number(e.target.value)
                  }
                })
              }
            >
              <option value={0}>Playing</option>
              <option value={1}>Streaming </option>
              <option value={2}>Listening</option>
              <option value={3}>Watching</option>
            </select>
            <textarea
              id="premium_bot_status"
              name="premium_bot_status"
              className="form-control"
              placeholder={strings.premium_bot_status}
              type="text"
              value={manage.status.name}
              onChange={(e) => {
                setManage({
                  ...manage,
                  status: {
                    ...manage.status,
                    name: e.target.value
                  }
                })
              }}
              autoComplete="off"
            />
          </div>
          {manage.status.type === 1 && (
            <input
              id="premium_bot_stream_url"
              name="premium_bot_stream_url"
              className="form-control mt-10"
              placeholder={strings.Username}
              pattern="https://.*"
              type="url"
              autoComplete="off"
              value={manage.status?.url?.replace('https://www.twitch.tv/', '')}
              onChange={(e) => {
                setManage({
                  ...manage,
                  status: {
                    ...manage.status,
                    url: `https://www.twitch.tv/${e.target.value.trim()}`
                  }
                })
              }}
            />
          )}
        </div>
      </div>
      {!isEqual(manage, initManageState) && (
        <div className="d-flex gap-1 justify-content-end pt-20">
          <button
            className="btn btn-primary btn-icon active"
            onClick={handleSubmit}
          >
            {strings.save}
          </button>
          <button
            className="btn btn-primary btn-icon"
            onClick={() => setManage(initManageState)}
          >
            {strings.cancel}
          </button>
        </div>
      )}
    </div>
  )
}
