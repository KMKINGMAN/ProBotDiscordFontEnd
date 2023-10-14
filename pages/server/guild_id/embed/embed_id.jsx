import Embed from '@component/embed/Embed'
import { Context } from '@script/_context'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import strings from '@script/locale'
import { INITIAL_EMBED_DATA } from '@script/constants'
import Unsaved from '@component/unsaved'
import axios from 'axios'
import Loading from '@component/loader'
import { useMemo } from 'react'
import ResponseRowWithActions from '@component/embed/ResponseModal/Row'
import { EmptyResponses } from '../../../../components/illustrations/empty-responses'
import { Button } from '../../../../components/ui/button'
import ResponseModal from '../../../../components/embed/ResponseModal'
import Onboarding from '../../../../components/ui/onboarding'

const SCHEMA = Yup.object().shape({
  name: Yup.string().required(strings.required),
  type: Yup.string().oneOf(['embed', 'message']),
  content: Yup.string().when('type', {
    is: 'message',
    then: Yup.string().when('content', (content, schema) => {
      if (content !== null) return schema.required(strings.required)

      return schema.default('')
    }),
    otherwise: Yup.string().nullable()
  }),
  embed: Yup.object().shape({
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

export default function () {
  const router = useRouter()
  const { guild, setGuild, Toast } = useContext(Context)
  const [loading, setLoading] = useState(true)
  const [openResponseModal, setOpenResponseModal] = useState(false)
  const [embedForEdit, setEmbedForEdit] = useState(null)
  const FORM_ID = `easy-embed-form__${router.query.embed_id}`
  const SELECTED_EMBED =
    guild.embeds?.find((e) => e._id === router.query.embed_id) || {}

  const INITIAL_VALUES = {
    ...INITIAL_EMBED_DATA,
    ...SELECTED_EMBED,
    reactions: JSON.parse(SELECTED_EMBED?.reactions || '[]'),
    embed: {
      ...INITIAL_EMBED_DATA.embed,
      ...(SELECTED_EMBED?.embed || {})
    }
  }

  const { values, errors, touched, handleSubmit, setValues } = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: SCHEMA,
    onSubmit: async (values) => {
      try {
        const { data } = await axios.put('/', {
          access: localStorage.ac,
          method: 'UPDATE_EMBED',
          guild_id: guild.id,
          embed: {
            ...(guild.embeds?.find((e) => e.id === router.query.embed_id) ||
              {}),
            embed: values.embed,
            content: values.content,
            type: values.type,
            name: values.name,
            reactions: values.reactions
          }
        })

        const selectedEmbed = data.find((e) => e.id === router.query.embed_id)
        setGuild({
          ...guild,
          embeds: data.map((embed) => ({
            ...embed,
            reactions: JSON.parse(embed.reactions || '[]')
          }))
        })
        setValues({
          ...INITIAL_EMBED_DATA,
          ...selectedEmbed,
          reactions: JSON.parse(selectedEmbed?.reactions || '[]'),
          embed: {
            ...INITIAL_EMBED_DATA.embed,
            ...selectedEmbed?.embed
          }
        })
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

  const getEmbeds = async () => {
    try {
      const { data } = await axios.get(`/guilds/${guild.id}/embeds`)
      setGuild({
        ...guild,
        embeds: data.map((embed) => ({
          ...embed,
          reactions: JSON.parse(embed.reactions || '[]')
        }))
      })
      setLoading(false)
    } catch (error) {
      console.log(error)
      Toast.fire({
        icon: 'error',
        title: error?.response?.data?.message || 'Something went wrong'
      })
    }
  }

  useEffect(() => {
    if (guild.embeds) return setLoading(false)
    getEmbeds()
  }, [guild])

  useMemo(() => {
    if (!router.query.embed_id) return
    setValues(
      guild.embeds?.find((e) => e.id === router.query.embed_id) ||
        INITIAL_VALUES
    )
  }, [router.query.embed_id])

  const UNSAVED_STATE = guild.embeds?.map((e) => {
    if (e.id === router.query.embed_id) {
      return {
        ...values,
        embed: {
          ...INITIAL_EMBED_DATA.embed,
          ...values.embed
        }
      }
    }
    return e
  })

  if (loading) return <Loading />
  return (
    <>
      <Unsaved
        type="array"
        method="embeds"
        state={UNSAVED_STATE}
        setStates={(values) => {
          const newValue = {
            ...INITIAL_EMBED_DATA,
            ...(values.find((e) => e.id === router.query.embed_id) || {}),
            embed: {
              ...INITIAL_EMBED_DATA.embed,
              ...(values.find((e) => e.id === router.query.embed_id)?.embed ||
                {})
            }
          }

          setValues(newValue)
        }}
        default={guild.embeds}
        formId={FORM_ID}
      />
      {openResponseModal ? (
        <ResponseModal
          isOpen={openResponseModal}
          handleClose={() => {
            setOpenResponseModal(false)
          }}
          setValues={setValues}
          values={values}
        />
      ) : null}

      <form
        id={FORM_ID}
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit()
        }}
      >
        <Embed
          {...{
            values: {
              ...INITIAL_EMBED_DATA,
              ...values,
              embed: {
                ...INITIAL_EMBED_DATA.embed,
                ...values.embed
              }
            },
            errors,
            touched,
            handleSubmit,
            setValues,
            id: router.query.embed_id,
            embedForEdit,
            setEmbedForEdit
          }}
        />
      </form>
      <hr className="tw-my-[20px] tw-border-x-0 tw-border-t-0 tw-border-solid tw-bg-grey-1" />
      <label className="control-label">
        {' '}
        {values.reactions?.length >= 1 ? strings.responses : null}
      </label>
      <div className="tw-mt-3 tw-flex tw-flex-col tw-gap-2">
        {values.reactions?.length >= 1 ? (
          <>
            {values.reactions?.map((reaction, index) => (
              <ResponseRowWithActions
                {...reaction}
                setValues={setValues}
                values={values}
                embedData={values}
                reaction={reaction}
                key={index}
                embedForEdit={embedForEdit}
                setEmbedForEdit={setEmbedForEdit}
                edit={() => {
                  setEmbedForEdit(reaction)
                }}
                duplicate={() => {
                  const generateRandomId = () =>
                    Math.floor(Math.random() * 1000000000)
                  const newReaction = {
                    ...reaction,
                    id: generateRandomId()
                  }
                  setValues({
                    ...values,
                    reactions: [...values.reactions, newReaction]
                  })
                }}
              />
            ))}
            <Onboarding
              title="Colors Set"
              text="Use flexibel responses for your embed messages"
            >
              <Button
                intent={'secondary'}
                type="button"
                onClick={() => setOpenResponseModal(true)}
                className={'tw-capitalize sm:tw-w-full'}
              >
                {strings.ADD_RESPONSE}
              </Button>
            </Onboarding>
          </>
        ) : (
          <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-6">
            <EmptyResponses />
            <p className="tw-m-0 tw-text-s2">
              No responses. create the first response!
            </p>
            <Button
              onClick={() => setOpenResponseModal(true)}
              intent={'secondary'}
            >
              {strings.ADD_RESPONSE}
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
