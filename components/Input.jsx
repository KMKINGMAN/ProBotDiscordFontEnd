import strings from '@script/locale'

export default function Input(props) {
  const {
    textarea,
    wrapperClassName,
    error,
    className,
    showErrorMessage = true,
    wrapperStyle,
    ...rest
  } = props

  if (textarea) {
    return (
      <div
        className={`${wrapperClassName ?? ''} ${error ? 'textarea-error' : ''}`}
        style={wrapperStyle ?? {}}
      >
        <textarea {...rest} className={`form-control ${className ?? ''}`} />
        {error && showErrorMessage && <span className="message">{strings[error] || error}</span>}
      </div>
    )
  }

  return (
    <div
      style={wrapperStyle ?? {}}
      className={`${wrapperClassName ?? ''} ${error ? 'input-error' : ''}`}
    >
      <input {...rest} className={`form-control ${className ?? ''}`} />
      {error && showErrorMessage && <span className="message">{strings[error] || error}</span>}
    </div>
  )
}
