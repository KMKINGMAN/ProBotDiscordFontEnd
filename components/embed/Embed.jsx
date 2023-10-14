import { useContext, useState, useEffect, useCallback } from 'react'
import moment from 'moment'
import axios from 'axios'
import { Context, socket } from '@script/_context'
import strings from '@script/locale'
import Alert from '@component/alert'
import Pt from '@style/PagesTitle.module.css'
import Loading from '@component/loader'
import { useRouter } from 'next/router'
import isEqual from 'lodash/isEqual'
import Head from 'next/head'
import EasyEmbed from '@component/EasyEmbed'
import ResponseModal from './ResponseModal'
import { isEmpty } from 'lodash'
import Input from '@component/Input'
import { Button } from '../ui/button'
import Onboarding from '../ui/onboarding'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalClose,
  ModalDescription
} from '../ui/modal'

export default function Embed(props) {
  const { id, values, errors, touched, setValues } = props
  const router = useRouter()
  const { guild, Toast, setGuild, rtl, user } = useContext(Context)
  const [currentEmbedIndex, setCurrentEmbedIndex] = useState()
  const [currentEmbed, setCurrentEmbed] = useState({})
  const [openModalEditEmbed, setOpenModalEditEmbed] = useState()
  const [openModalSendMsg, setOpenModalSendMsg] = useState()
  const [openResponseModal, setOpenResponseModal] = useState(
    !!props.embedForEdit
  )
  const [editList, setEditList] = useState()
  const [loading, setLoading] = useState(false)
  const [alerto, setAlert] = useState(true)
  const [openDeleteModal, setOpenDeleteModal] = useState(null)
  // const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    setCurrentEmbedIndex(guild.embeds?.findIndex((e) => e.id === id))
    setCurrentEmbed(guild.embeds?.find((e) => e.id === id) || {})
  }, [guild.embeds, id])

  const getEmbedsSent = useCallback(async () => {
    try {
      const { data } = await axios.get(`/${guild?.id}/embeds_sent?id=${id}`)
      if (!data) return
      setEditList([...data])
    } catch (error) {
      console.log(error)
    }
  }, [guild, id])

  useEffect(() => {
    if (openModalEditEmbed !== true) return
    getEmbedsSent()
  }, [openModalEditEmbed])

  const onSocketGuildMessage = useCallback(
    (e) => {
      console.log(`[WEBSOCKET] [GUILD] [EMBED]`, user.id, e.id, guild.id, e)
      if (e.user_id !== user.id) return
      if (e.id !== guild.id) return
      Toast.fire({
        icon: e.success ? 'success' : 'error',
        title: e.success ? strings.success : e.error
      })
    },
    [guild]
  )

  useEffect(() => {
    socket.on('embed', onSocketGuildMessage)
    return () => socket.removeListener('embed', onSocketGuildMessage)
  }, [onSocketGuildMessage])

  useEffect(() => {
    if (currentEmbedIndex) {
      setCurrentEmbed(guild.embeds?.find((e) => e.id === currentEmbed.id) || {})
    }
  }, [currentEmbedIndex])

  const deleteEmbed = () => {
    axios
      .put('/', {
        access: localStorage.ac,
        method: 'DELETE_EMBED',
        guild_id: guild.id,
        embed_id: currentEmbed.id
      })
      .then((res) => res.data)
      .then((data) => {
        setGuild({ ...guild, embeds: data })
      })
      .then(() => {
        Toast.fire({
          icon: 'success',
          title: strings.success
        })
        setOpenDeleteModal(false)
        router.push(`/server/${guild.id}/embed`)
      })
  }

  const sendEmbed = (method, extra_info) => {
    axios
      .put('/', {
        access: localStorage.ac,
        method,
        extra_info,
        embed: currentEmbed,
        guild_id: guild.id
      })
      .then(() => {
        // Toast.fire({
        //   icon: "success",
        //   title: strings.success,
        // });
      })
  }

  if (loading) return <Loading />

  return (
    <>
      <Head>
        <title>
          {strings.embeder} - {guild?.name}
        </title>
      </Head>
      <div className={`${Pt['pages-title']} ${Pt['embed-page-title']}`}>
        <div>
          <h3 className="mt-10">{strings.embeder}</h3>
        </div>
        <div className={'tw-flex tw-gap-3 sm:tw-w-full sm:tw-flex-wrap'}>
          <select
            name="server-embeds"
            id="server-embeds"
            value={currentEmbed.id}
            className="form-control form-select"
            onChange={(event) => {
              let id = event.target.value
              let dialog =
                isEqual(
                  currentEmbed,
                  guild.embeds.find((e) => e.id === currentEmbed.id) || {}
                ) || confirm(strings.UNSAVED_CONFIRM)
              if (dialog === true)
                router.push(`/server/${guild.id}/embed/${id}`)
            }}
          >
            <option value="">{strings.rr_select_embed}</option>
            {guild.embeds?.map((embed, index) => (
              <option key={index} value={embed.id}>
                {embed.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DELETE MESSAGE */}
      <Modal open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{strings.are_you_sure}</ModalTitle>
            <ModalDescription>
              {currentEmbed.name &&
                strings.formatString(
                  strings.do_you_really,
                  <span className="tw-text-white">"{currentEmbed.name}"</span>
                )}
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button
              onClick={() => setOpenDeleteModal(false)}
              type={'button'}
              intent={'secondary'}
              className="sm:tw-w-full"
            >
              {strings.cancel}
            </Button>

            <Button
              intent={'danger'}
              className={'sm:tw-w-full'}
              // loading={deleteLoading}
              onClick={() => deleteEmbed()}
            >
              {strings.embed_delete}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* EDIT MESSAGE */}
      <Modal open={openModalEditEmbed} onOpenChange={setOpenModalEditEmbed}>
        <ModalContent className="tw-max-w-2xl">
          <ModalHeader>
            <ModalTitle>{strings.embed_edit.toLowerCase()}</ModalTitle>
          </ModalHeader>
          <select
            className="form-control"
            onChange={(event) =>
              setOpenModalEditEmbed(
                event.target.value === 'true' ? true : event.target.value
              )
            }
          >
            <option value={true}>{strings.embed_choosemsg}</option>
            {editList ? (
              editList.map((m, i) => (
                <option
                  key={`chsend${i}`}
                  value={JSON.stringify({
                    msg: m.msg || m.messageId,
                    channel: m.channel || m.channelId
                  })}
                >
                  #
                  {guild?.channels?.find(
                    (c) => c.id === m.channelId || m.channel
                  )?.name || 'unknown'}
                  - {moment(m.date).local().format('YYYY-MM-DD hh:mm:ss A')}
                </option>
              ))
            ) : (
              <option>Loading ...</option>
            )}
          </select>
          <ModalFooter>
            <Button
              onClick={() => setOpenModalEditEmbed(false)}
              type={'button'}
              intent={'secondary'}
              className="sm:tw-w-full"
            >
              {strings.cancel}
            </Button>

            <Button
              intent={'primary'}
              className={'sm:tw-w-full'}
              disabled={openModalEditEmbed === true}
              onClick={() => {
                sendEmbed('EDIT_EMBED', openModalEditEmbed)
                setOpenModalEditEmbed(false)
              }}
            >
              {strings.embed_edit}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* SEND MESSAGE  */}
      <Modal open={openModalSendMsg} onOpenChange={setOpenModalSendMsg}>
        <ModalContent className="tw-max-w-2xl">
          <ModalHeader>
            <ModalTitle>{strings.embed_send.toLowerCase()}</ModalTitle>
          </ModalHeader>
          <select
            className="form-control"
            value={openModalSendMsg}
            onChange={(event) =>
              setOpenModalSendMsg(
                event.target.value === 'true' ? true : event.target.value
              )
            }
          >
            <option value={true}>{strings.embed_choosechannel}</option>
            {guild?.channels
              ?.filter((c) => [0, 5].includes(c.type))
              .map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.name}
                </option>
              ))}
          </select>
          <ModalFooter>
            <Button
              onClick={() => setOpenModalSendMsg(false)}
              type={'button'}
              intent={'secondary'}
              className="sm:tw-w-full"
            >
              {strings.cancel}
            </Button>

            <Button
              intent={'primary'}
              className={'sm:tw-w-full'}
              onClick={() => {
                sendEmbed('SEND_EMBED', openModalSendMsg)
              }}
              disabled={openModalSendMsg === true}
            >
              {strings.embed_send}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/*  */}
      <ResponseModal
        isOpen={openResponseModal || !!props.embedForEdit}
        handleClose={() => {
          setOpenResponseModal(false)
          props.setEmbedForEdit(null)
        }}
        setValues={setValues}
        values={values}
        embedForEdit={props.embedForEdit}
      />
      {Object.keys(currentEmbed).length ? (
        <div
          id={`embed-form__${id}`}
          className="row-container mt-25 embed-form sm:tw-w-full"
        >
          <div className="tw-flex tw-justify-end tw-gap-2">
            <Button
              type="button"
              intent={'secondary'}
              onClick={() => setOpenModalSendMsg(true)}
              className={'tw-capitalize sm:tw-w-full'}
            >
              <div className="btn-icon" style={{ padding: 0 }}>
                <span>{strings.embed_send.toLowerCase()}</span>
              </div>
            </Button>
            <Onboarding
              title={strings.responses_onboarding_title}
              text={strings.responses_onboarding_content}
              item={'responses'}
              side={'left'}
              sideOffset={4}
              align={'start'}
            >
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      type="button"
                      intent={'secondary'}
                      size="small"
                      className={'tw-px-1'}
                    >
                      <svg
                        width="23"
                        height="23"
                        viewBox="0 0 23 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17 14.5C17 15.3284 17.6716 16 18.5 16C19.3284 16 20 15.3284 20 14.5C20 13.6716 19.3284 13 18.5 13C17.6716 13 17 13.6716 17 14.5Z"
                          fill="white"
                        />
                        <path
                          d="M10 14.5C10 15.3284 10.6716 16 11.5 16C12.3284 16 13 15.3284 13 14.5C13 13.6716 12.3284 13 11.5 13C10.6716 13 10 13.6716 10 14.5Z"
                          fill="white"
                        />
                        <path
                          d="M3 14.5C3 15.3284 3.67157 16 4.5 16C5.32843 16 6 15.3284 6 14.5C6 13.6716 5.32843 13 4.5 13C3.67157 13 3 13.6716 3 14.5Z"
                          fill="white"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setOpenResponseModal(true),
                          localStorage.setItem(`responses_onboarding`, 'false'),
                          document.getElementById('onboarding')?.remove()
                      }}
                      className={'tw-flex tw-flex-row-reverse tw-gap-9'}
                    >
                      <span className="tw-h-5 tw-rounded tw-bg-purple-main tw-px-2 tw-text-[13px] tw-font-semibold tw-uppercase tw-text-white">
                        {strings.new}
                      </span>
                      {strings.ADD_RESPONSE}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setOpenModalEditEmbed(true)}
                    >
                      {strings.embed_edit.toLowerCase()}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      data-button={'delete'}
                      className="tw-text-red-500"
                      onClick={() => setOpenDeleteModal(true)}
                    >
                      {strings.embed_delete.toLowerCase()}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Onboarding>
          </div>
          <EasyEmbed
            beforeSwitcher={
              <div>
                <label htmlFor="embed-name" className="control-label">
                  {strings.embed_name}
                </label>
                <Input
                  type="text"
                  placeholder={strings.embed_name}
                  value={values.name}
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
                  id="embed-name"
                  name="embed-name"
                  error={errors?.name}
                />
              </div>
            }
            errors={!isEmpty(touched) && errors}
            value={values}
            onChange={(content) => {
              setValues(content)
            }}
          />
        </div>
      ) : (
        <div className="text-align-center">
          {guild.embeds?.length ? (
            <div className="select-embed-container">
              <Alert
                open={alerto}
                type="info"
                handelClose={() => setAlert(false)}
                children={strings.rr_select_embed}
                className="full-width"
              />
            </div>
          ) : (
            <div className="select-embed-container">
              <Alert
                open={alerto}
                type="info"
                handelClose={() => setAlert(false)}
                children={strings.rr_create_embed}
                className="full-width"
              />
              <img src="/static/empty.svg" alt="select embed" />
            </div>
          )}
        </div>
      )}
    </>
  )
}
