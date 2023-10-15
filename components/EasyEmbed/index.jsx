import ColorListPicker from '@component/ColorListPicker'
import DragDropFiles from '@component/DragDropFiles'
import Input from '@component/Input'
import { Context } from '@script/_context'
import axios from 'axios'
import { useContext } from 'react'
import AlignHorizontallyIcon from './AlignHorizontallyIcon'
import AlignLeftIcon from './AlignLeftIcon'
import strings from '@script/locale'

export default function EasyEmbed({
  errors,
  value,
  onChange,
  textareaHint = false,
  beforeSwitcher = null,
  containerClassNames = ''
}) {
  const { guild, Toast } = useContext(Context)

  const handleChange = (key, val) => {
    const array = JSON.parse(JSON.stringify(value))
    const split = key.split('.').map((k) => (!isNaN(k) ? parseInt(k) : k))
    if (split.length === 1) {
      array[key] = val
    } else if (split.length === 2) {
      array[split[0]][split[1]] = val
    } else if (split.length === 3) {
      array[split[0]][split[1]][split[2]] = val
    } else if (split.length === 4) {
      array[split[0]][split[1]][split[2]][split[3]] = val
    }

    onChange(array)
  }

  const handleAddField = () => {
    handleChange('embed.fields', [
      ...value.embed.fields,
      {
        name: '',
        value: '',
        inline: false
      }
    ])
  }
  const handleDeleteField = (index) => {
    handleChange(
      'embed.fields',
      value.embed.fields.filter((_, i) => i !== index)
    )
  }
  const handleToggleInline = (index) => {
    handleChange(
      'embed.fields',
      value.embed.fields.map((field, i) => {
        if (i === index)
          return {
            ...field,
            inline: !field.inline
          }
        return field
      })
    )
  }

  const handleUploadImage = async (name, file) => {
    if (!file) return handleChange(name, '')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('id', guild.id)
      formData.append('type', 'guild')
      formData.append('module', 'embed')

      const { data } = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      handleChange(name, data.success)
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
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
    }
  }

  return (
    <div
      className={`easy-embed tw-rounded-lg tw-bg-grey-4 ${
        containerClassNames || ''
      }`}
    >
      {beforeSwitcher || null}
      <div className="toggle-buttons">
        {['message', 'embed'].map((type) => (
          <button
            type="button"
            key={type}
            className={type === value.type ? 'active' : ''}
            onClick={() => handleChange('type', type)}
          >
            {strings[type]}
          </button>
        ))}
      </div>
      <Input
        textarea
        showErrorMessage
        placeholder={strings.embed_message_content}
        name="content"
        value={value.content}
        onChange={(e) => handleChange('content', e.target.value)}
        error={errors?.content}
      />
      {textareaHint ? textareaHint : null}
      {value.type === 'embed' && (
        <div
          className="embed"
          style={{ borderColor: `#${value.embed.color.toString(16)}` }}
        >
          <div className="embed__header">
            <div className="color-picker-author-info">
              <div className="d-flex align-items-center gap-3">
                <span className="text-muted">{strings.easy_embed_color}</span>
                <ColorListPicker
                  activeColor={value.embed.color}
                  onChange={(color) => handleChange('embed.color', color)}
                />
              </div>
              <div className="d-flex align-items-center flex-wrap gap-2">
                <div className="embed__dropdown-files change-author-avatar align-self-start">
                  <DragDropFiles
                    accept={['png', 'jpg', 'jpeg', 'gif']}
                    handleChange={(file) =>
                      handleUploadImage('embed.author.icon_url', file)
                    }
                    uploadedFile={value.embed.author.icon_url}
                    hoverTitle="drop here"
                    dropMessageStyle={{ backgroundColor: '#36393f' }}
                    name="icon_url"
                  />
                </div>
                <Input
                  type="text"
                  placeholder={strings.embed_name}
                  value={value.embed.author?.name}
                  onChange={(e) =>
                    handleChange('embed.author.name', e.target.value)
                  }
                  name="author.name"
                  error={errors?.embed?.author?.name}
                  wrapperStyle={{ flex: '1 1 150px' }}
                  wrapperClassName="align-self-start"
                />
                <Input
                  type="text"
                  placeholder={strings.embed_url}
                  name="author.url"
                  value={value.embed.author?.url}
                  onChange={(e) =>
                    handleChange('embed.author.url', e.target.value)
                  }
                  error={errors?.embed?.author?.url}
                  wrapperStyle={{ flex: '1 1 150px' }}
                  wrapperClassName="align-self-start"
                />
              </div>
              <hr />
            </div>
            <div className="embed__dropdown-files thumbnail">
              <DragDropFiles
                accept={['png', 'jpg', 'jpeg', 'gif']}
                handleChange={(file) =>
                  handleUploadImage('embed.thumbnail.url', file)
                }
                uploadedFile={value.embed.thumbnail?.url}
                hoverTitle="drop here"
                dropMessageStyle={{ backgroundColor: '#36393f' }}
                name="thumbnail"
              />
            </div>
          </div>
          <div className="embed__body">
            <Input
              type="text"
              placeholder={strings.embed_title}
              name="embed.title"
              value={value.embed.title}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              error={errors?.embed?.title}
            />
            <Input
              textarea
              showErrorMessage
              placeholder={strings.embed_description}
              name="embed.description"
              value={value.embed.description}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="mt-16"
              error={errors?.embed?.description}
            />
            <hr />
            <div className="embed__body__fields">
              {value.embed.fields.map((field, index) => (
                <div className="embed__body__field mt-15" key={index}>
                  <div className="d-flex align-items-center gap-2">
                    <Input
                      wrapperClassName="flex-1"
                      type="text"
                      placeholder={strings.embed_title}
                      name={`embed.fields.${index}.name`}
                      value={field.name}
                      onChange={(e) =>
                        handleChange(e.target.name, e.target.value)
                      }
                      error={errors?.embed?.fields?.[index]?.name}
                    />
                    <div className="field-actions">
                      <div className="switch-inline">
                        <button
                          className={field.inline ? '' : 'active'}
                          type="button"
                          onClick={() => handleToggleInline(index)}
                        >
                          <AlignLeftIcon />
                        </button>
                        <button
                          className={field.inline ? 'active' : ''}
                          type="button"
                          onClick={() => handleToggleInline(index)}
                        >
                          <AlignHorizontallyIcon />
                        </button>
                      </div>
                      <button
                        className="delete-button-alt"
                        type="button"
                        onClick={() => handleDeleteField(index)}
                      >
                        <i className="fas fa-trash-alt" />
                      </button>
                    </div>
                  </div>
                  <Input
                    textarea
                    showErrorMessage
                    placeholder={strings.embed_value}
                    name={`embed.fields.${index}.value`}
                    value={field.value}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    className="mt-16"
                    error={errors?.embed?.fields?.[index]?.value}
                  />
                </div>
              ))}
              {value.embed.fields.length < 25 && (
                <div className="d-flex justify-content-end">
                  <button
                    className={`btn btn-secondary${
                      value.embed.fields.length > 0 ? ' mt-15' : ''
                    }`}
                    type="button"
                    onClick={handleAddField}
                  >
                    {strings.add_field}
                  </button>
                </div>
              )}
              <hr />
              <div
                className="embed__dropdown-files change-image-url"
                style={!value.embed.image?.url ? { width: '100%' } : {}}
              >
                <DragDropFiles
                  accept={['png', 'jpg', 'jpeg', 'gif']}
                  handleChange={(file) =>
                    handleUploadImage('embed.image.url', file)
                  }
                  uploadedFile={value.embed.image?.url}
                  hoverTitle="drop here"
                  dropMessageStyle={{ backgroundColor: '#36393f' }}
                  name="image_url"
                  className="image_url"
                />
              </div>
            </div>
            <hr />
            <div className="embed__body__footer">
              <div className="d-flex align-items-center gap-2">
                <div className="embed__dropdown-files change-author-avatar">
                  <DragDropFiles
                    accept={['png', 'jpg', 'jpeg', 'gif']}
                    handleChange={(file) =>
                      handleUploadImage('embed.footer.icon_url', file)
                    }
                    uploadedFile={value.embed.footer?.icon_url}
                    hoverTitle="drop here"
                    dropMessageStyle={{ backgroundColor: '#36393f' }}
                    name="footer_icon_url"
                  />
                </div>
                <Input
                  wrapperClassName="flex-1"
                  type="text"
                  placeholder={strings.embed_footer}
                  name="embed.footer.text"
                  value={value.embed.footer?.text}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  error={errors?.embed?.footer?.text}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
