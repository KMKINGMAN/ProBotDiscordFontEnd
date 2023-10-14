import * as React from 'react'
import IChangeBackgroundProps, { StateTypes } from './types'
import style from '@style/userPremium.module.css'
import { FileUploader } from 'react-drag-drop-files'
import { fileTypes, maxFileSize } from './data'
import axios from 'axios'
import Loading from '../../loader'
import Image from 'next/image'
import strings from '@script/locale'
import { Context } from '@script/_context'
import { useState, useEffect, useContext } from 'react'

export default function ChangeBackground(props: IChangeBackgroundProps) {
  const { user, Toast } = useContext(Context)
  const { type } = props
  const [isLoading, setLoading] = useState(true)
  const [colorLoading, setColorLoading] = useState(false)
  const [isColored, setisColored] = useState(
    type === 'PROFILE' ? !user.profile_noColor : !user.id_noColor
  )
  const [background, setBackground] = useState('')
  const [state, setStates] = useState<StateTypes>({
    status: '',
    file: background || null,
    errorMessage: '',
    nocolor: isColored
  })
  const setState = (newState: StateTypes) =>
    setStates({ ...state, ...newState })
  const [showFullImageFullScreen, setShowFullImageFullScreen] = useState(false)

  useEffect(() => {
    const getBackgrounds = async () => {
      try {
        const { data } = await axios.get('/membership/background')
        props.type === 'PROFILE'
          ? setBackground(data.profile)
          : setBackground(data.id)
      } catch (error) {
        console.log(error)
      }
    }

    getBackgrounds()
  }, [state])

  const handleColorChange = async () => {
    setColorLoading(true)
    try {
      const { data } = await axios.patch('/membership/background', {
        type: type.toLowerCase(),
        nocolor: state.nocolor ? 0 : 1
      })
      Toast.fire({
        icon: 'success',
        title: strings.success
      })
      setState({ nocolor: isColored })
      setisColored(!isColored)
      setColorLoading(false)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = async (file: File) => {
    const fileSize = file.size
    if (fileSize > maxFileSize) {
      setState({
        status: 'ERROR',
        errorMessage: 'File size must be less than 3MB and type must be image'
      })
      return
    }
    try {
      setState({ status: 'LOADING', file: URL.createObjectURL(file) })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type.toLowerCase())
      formData.append('nocolor', (state.nocolor ? 0 : 1).toString())
      const { data } = await axios.post('/membership/background', formData)
      setState({
        file: URL.createObjectURL(file),
        status: 'APPROVED',
        nocolor: state.nocolor
      })
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  const DATA = {
    PROFILE: {
      title: strings.membership_background_profile,
      description: strings.membership_background_profile_description
    },
    ID: {
      title: strings.membership_background_id,
      description: strings.membership_background_id_description
    }
  }
  const currentData = DATA[type]

  const UPLOAD_FILE_TEXT = {
    LOADING: (
      <div className={style['change-background__file-uploader__loading']}>
        <img src={state.file as string} alt="" />
        <Loading type="2" />
      </div>
    ),
    WAITING_APPROVAL: 'Waiting for approval...',
    APPROVED: 'Approved!',
    REJECTED: 'Rejected!',
    ERROR: (
      <div className={style['change-background__file-uploader__text']}>
        {strings.membership_background_upload}
      </div>
    )
  }
  const currentUploadText = UPLOAD_FILE_TEXT[state.status] || (
    <div className={style['change-background__file-uploader__text']}>
      {strings.formatString(
        strings.membership_background_upload,
        <span>{strings.membership_background_click_upload}</span>
      )}
    </div>
  )

  const profilePreview = (type: string) => {
    if (type === 'ID') {
      return `${process.env.NEXT_PUBLIC_API_URL}/rank/224308865427046402/${
        user.id
      }?name=${user.name}&background=${background.split('/').at(-1)}&nocolor=${
        !isColored ? 1 : 0
      }`
    } else {
      return `${process.env.NEXT_PUBLIC_API_URL}/profile/${user.id}?name=${
        user.name
      }&background=${background.split('/').at(-1)}&nocolor=${
        !isColored ? 1 : 0
      }`
    }
  }

  const loader = ({ src }) => {
    return src
  }

  return (
    <div className={style['change-background__wrapper']}>
      {showFullImageFullScreen && (
        <div
          className={style['change-background__full-image-full-screen']}
          onClick={() => setShowFullImageFullScreen(false)}
        >
          <Image
            src={profilePreview(props.type)}
            alt="full screen uploaded image"
            blurDataURL={background}
            loader={loader}
            placeholder="blur"
            height={props.type === 'PROFILE' ? 400 : 188}
            width={props.type === 'PROFILE' ? 400 : 500}
            unoptimized
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: '90%',
              maxHeight: '90%'
            }}
            className={`
              tw-duration-700 tw-ease-in-out group-hover:tw-opacity-75
              ${
                isLoading
                  ? 'tw-blur-lg tw-grayscale'
                  : 'tw-blur-0 tw-grayscale-0'
              })`}
            onLoadingComplete={() => setLoading(false)}
          />
        </div>
      )}
      {state.status !== 'LOADING' &&
        (state.status === 'APPROVED' || background) && (
          <div className={style['change-background__approved']}>
            <Image
              src={(state.file as string) || background}
              alt="uploaded image"
              blurDataURL={
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAY'
              }
              placeholder="blur"
              height={550}
              width={150}
              style={{
                maxHeight: '150px',
                width: '100%'
              }}
            />
            {/* <img src={(state.file as string) || background} alt="" /> */}
            <button
              onClick={() => {
                setShowFullImageFullScreen(true), setLoading(true)
              }}
              className={`hover:tw-bg-grey-2 hover:tw-text-white tw-bottom-4 tw-duration-200 tw-transition-all tw-right-4 tw-text-grey-text2 ${style['colored-active-button']}`}
            >
              <i className="fa-sharp fa-solid fa-eye"></i>
            </button>
            <button
              disabled={colorLoading}
              className={`hover:tw-bg-purple-main hover:tw-text-white tw-text-grey-text2 tw-bottom-4 tw-duration-200 tw-transition-all ${
                isColored
                  ? `${style['colored-active-button']} tw-bg-purple-main tw-text-white hover:tw-bg-purple-hover`
                  : style['colored-button']
              }`}
              onClick={() => handleColorChange()}
            >
              <i
                className={`fa-solid fa-wand-magic-sparkles ${
                  colorLoading ? 'fa-shake' : ''
                }`}
              ></i>
            </button>
          </div>
        )}
      <div className="tw-flex tw-flex-col tw-gap-6 tw-px-6 tw-pt-5">
        <div className={style['change-background__text']}>
          <h3>{currentData.title}</h3>
          <p>{currentData.description}</p>
        </div>
        <div
          className={style['change-background__file-uploader__wrapper']}
          style={{
            paddingBottom: state.status === 'ERROR' ? '0' : '24px'
          }}
        >
          <FileUploader
            handleChange={handleChange}
            name="file"
            types={fileTypes}
            classes={
              state.status !== 'LOADING' &&
              (state.status === 'APPROVED' || background)
                ? ''
                : style['change-background__file-uploader']
            }
            disabled={state.status === 'LOADING'}
          >
            {state.status !== 'LOADING' &&
            (state.status === 'APPROVED' || background) ? (
              <button className={style['membership__button']} role="button">
                {strings.membership_background_change}
              </button>
            ) : (
              currentUploadText
            )}
          </FileUploader>
        </div>
      </div>
      {state.status === 'ERROR' && (
        <div className={style['change-background__error']}>
          <span>
            {state.errorMessage || 'Something went wrong, please try again'}
          </span>
        </div>
      )}
    </div>
  )
}
