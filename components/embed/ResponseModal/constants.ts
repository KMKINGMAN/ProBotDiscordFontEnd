import { INITIAL_EMBED_DATA } from '@script/constants'
import * as yup from 'yup'
import strings from '@script/locale'

export type INITIAL_VALUES_TYPE = {
  id: string
  type: number
  style: number
  response: typeof INITIAL_EMBED_DATA

  placeholder: string
  options:
    | [
        {
          label: string
          description: string
          emoji: object
          id: string
          response: typeof INITIAL_EMBED_DATA
        }
      ]
    | []
}

export const INITIAL_VALUES: INITIAL_VALUES_TYPE = {
  id: '',
  type: 3,
  placeholder: '',
  style: 1,
  options: [],
  response: INITIAL_EMBED_DATA
}

const FULL_RESPONSE_SCHEMA = yup.object().shape({
  type: yup.string().oneOf(['embed', 'message']),
  content: yup.string().when('type', {
    is: 'message',
    then: yup.string().required(),
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
            then: yup.string().required()
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
})

export const VALIDATION_SCHEMA = yup.object().shape({
  type: yup.number().oneOf([2, 3]).required(),
  emoji: yup.object().nullable(),
  placeholder: yup.string().when('type', {
    is: 3,
    then: yup.string().required(),
    otherwise: yup.string().default('')
  }),

  style: yup.number().oneOf([1, 2, 3, 4]).required(),
  options: yup.array().when('type', {
    is: 3,
    then: yup
      .array()
      .of(
        yup.object().shape({
          label: yup.string().required("Label can't be empty"),
          description: yup.string(),
          emoji: yup.object().nullable(),
          id: yup.string(),
          response: FULL_RESPONSE_SCHEMA
        })
      )
      .min(1)
      .required(),
    otherwise: yup.array().default([])
  }),
  response: yup.object().when('type', {
    is: 3,
    then: yup.object(),
    otherwise: FULL_RESPONSE_SCHEMA
  })
})
