import Dropdown from '@component/dropdown'
import Link from 'next/link'
import strings from '@script/locale'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalClose,
  ModalDescription,
  ModalTrigger
} from '@component/ui/modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@component/ui/dropdown'
import { useContext, useState } from 'react'
import EasyEmbed from '@component/EasyEmbed'
import ButtonSettings from './ButtonSettings'
import SelectMenus from './SelectMenus'
import { useFormik } from 'formik'
import { INITIAL_VALUES, VALIDATION_SCHEMA } from './constants'
import { Context } from '@script/_context'
import axios from 'axios'
import { Button } from '@component/ui/button'
import { INITIAL_EMBED_DATA } from '@script/constants'
import { useRouter } from 'next/router'

export default function ResponseRowWithActions(props: any) {
  const router = useRouter()

  const [deleteModal, setDeleteModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteIsLoading, setdeleteIsLoading] = useState(false)

  const { guild, setGuild, Toast } = useContext(Context)

  const { values, errors, touched, handleSubmit, setValues, resetForm } =
    useFormik({
      initialValues: props.reaction,
      validationSchema: VALIDATION_SCHEMA,
      onSubmit: async (values) => {
        try {
          const { data } = await axios.put('/', {
            access: localStorage.ac,
            method: 'UPDATE_EMBED',
            guild_id: guild.id,
            embed: {
              ...props.embedData,
              reactions: props.embedData.reactions.map((reaction) =>
                reaction.id === values.id
                  ? { ...reaction, ...values }
                  : reaction
              )
            }
          })

          setGuild({
            ...guild,
            embeds: data.map((embed: any) => ({
              ...embed,
              reactions: JSON.parse(embed.reactions || '[]')
            }))
          })
          setEditModal(false)
          Toast.fire({
            icon: 'success',
            title: strings.success
          })
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
  const deleteResponse = () => {
    setdeleteIsLoading(true)
    const newReactions = props.values.reactions.filter(
      (reaction: any) => reaction.id !== props.reaction.id
    )

    axios
      .put(`/`, {
        access: localStorage.ac,
        method: 'UPDATE_EMBED',
        guild_id: guild.id,
        embed: {
          ...(guild.embeds?.find((e) => e.id === router.query.embed_id) || {}),
          embed: props.values.embed,
          content: props.values.content,
          type: props.values.type,
          name: props.values.name,
          reactions: newReactions
        }
      })
      .then((response) => {
        const selectedEmbed = response.data.find(
          (e) => e.id === router.query.embed_id
        )
        setGuild({
          ...guild,
          embeds: response.data.map((embed) => ({
            ...embed,
            reactions: newReactions || '[]'
          }))
        })
        setValues({
          ...INITIAL_EMBED_DATA,
          ...selectedEmbed,
          reactions: newReactions || '[]',
          embed: {
            ...INITIAL_EMBED_DATA.embed,
            ...selectedEmbed?.embed
          }
        })
        setdeleteIsLoading(false)
        setDeleteModal(false)
        Toast.fire({
          icon: 'success',
          title: strings.success
        })
      })
  }

  return (
    <>
      {/* DELETE MODAL> */}
      <Modal open={deleteModal} onOpenChange={setDeleteModal}>
        <ModalContent>
          <ModalTitle>
            {strings.delete_response} "
            {props.type === 2 ? props.label : props.placeholder}"
          </ModalTitle>
          <ModalDescription className="tw-text-s2">
            {strings.delete_response_ask}
          </ModalDescription>
          <ModalFooter>
            <ModalClose>
              <Button
                intent="secondary"
                className={'sm:tw-w-full'}
                aria-label="Close"
              >
                {strings.cancel}
              </Button>
            </ModalClose>
            <Button
              intent="danger"
              className={'sm:tw-w-full'}
              onClick={() => {
                deleteResponse()
              }}
              isLoading={deleteIsLoading}
            >
              {strings.delete_response}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* EDIT MODAL */}
      <Modal open={editModal} onOpenChange={setEditModal}>
        <ModalContent
          onInteractOutside={() => resetForm()}
          style={{ width: '1240px' }}
        >
          <ModalHeader>
            <ModalTitle>{strings.edit_response}</ModalTitle>
          </ModalHeader>
          <form
            id="responseForm"
            className="no-scroll tw-max-h-[70vh] tw-overflow-y-auto tw-overflow-x-hidden"
            onSubmit={handleSubmit}
          >
            <label className="control-label">{strings.response_type}</label>
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
                  values={props.reaction}
                  {...{ values, setValue: setValues, errors, touched }}
                />
              ) : (
                <ButtonSettings {...{ values, setValue, errors, touched }} />
              )}
            </div>
          </form>
          <ModalFooter>
            <ModalClose>
              <Button
                intent="secondary"
                type={'button'}
                className={'sm:tw-w-full'}
                onClick={() => resetForm()}
              >
                {strings.cancel}
              </Button>
            </ModalClose>
            <Button
              className={'sm:tw-w-full'}
              type="submit"
              form="responseForm"
              intent="primary"
            >
              {strings.edit_response}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div
        onClick={() => {
          setEditModal(true)
        }}
        className="tw-flex tw-cursor-pointer tw-items-center tw-justify-between tw-rounded-md tw-bg-grey-4 tw-px-[20px] tw-py-[16px] tw-text-white tw-duration-200 hover:tw-ring-1 hover:tw-ring-grey-2"
      >
        <div className="tw-flex tw-flex-col tw-gap-1 ">
          <h3 className="tw-m-0 tw-text-s2 tw-text-white">
            {(props.type === 2 ? props.label : props.placeholder) || 'Response'}
          </h3>
          <p className="tw-m-0 tw-text-s3 tw-text-grey-text2">
            {props.response?.content || props.response?.embed?.title}
          </p>
        </div>
        <div className="action">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="tw-rounded-lg tw-py-1 tw-duration-200 hover:tw-bg-grey-3">
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="11.5" cy="4.5" r="1.5" fill="#9292A0" />
                  <circle cx="11.5" cy="11.5" r="1.5" fill="#9292A0" />
                  <circle cx="11.5" cy="18.5" r="1.5" fill="#9292A0" />
                </svg>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => setEditModal(true)}>
                {strings.EDIT}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => props.duplicate()}>
                {strings.duplicate}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                data-button={'delete'}
                onClick={() => setDeleteModal(true)}
              >
                {strings.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  )
}
