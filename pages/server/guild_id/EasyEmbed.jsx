import EasyEmbed from '@component/EasyEmbed'
import Unsaved from '@component/unsaved'
import { SINGLE_EMBED_SCHEMA, INITIAL_EMBED_DATA } from '@script/constants'
import { useFormik } from 'formik'
import { isEmpty } from 'lodash'

export default function EasyEmbedPage() {
  const { values, errors, touched, handleChange, handleSubmit, setValues } =
    useFormik({
      initialValues: INITIAL_EMBED_DATA,
      validationSchema: SINGLE_EMBED_SCHEMA,
      onSubmit: (values) => {
        console.log(values)
      }
    })

  console.log(errors)

  return (
    <>
      <Unsaved
        method="easy_embed"
        state={values}
        setStates={(values) => {
          setValues(values)
        }}
        default={INITIAL_EMBED_DATA}
        formId="easy-embed-form"
      />
      <form
        id="easy-embed-form"
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit()
        }}
      >
        <EasyEmbed
          errors={!isEmpty(touched) && errors ? errors : {}}
          values={values}
          handleChange={handleChange}
        />
      </form>
    </>
  )
}
