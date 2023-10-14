import inputs from '../styles/fields.module.css'
export function FilledInput({ label, handleClick, className }) {
  return (
    <button
      onClick={handleClick}
      className={`${inputs['filled-input']} ${className ? className : ''}`}
    >
      {label}
    </button>
  )
}

export function OutlinedInput({
  label,
  onChange,
  onClick,
  type,
  value,
  className,
  placeholder,
  id
}) {
  return (
    <div className={`${className ? className : ''} ${inputs.outlinedInput}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onClick={onClick}
        placeholder={placeholder}
      />
    </div>
  )
}

export function FilledSelectInput({
  label,
  children,
  className,
  id,
  labelClassName
}) {
  return (
    <div
      id={id}
      className={`${inputs['filled-select-input']} ${
        className ? className : ''
      }`}
    >
      <label
        className={`control-label ${labelClassName ? labelClassName : ''}`}
        htmlFor={id}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

export function Textarea({
  label,
  onChange,
  value,
  className,
  placeholder,
  id
}) {
  return (
    <div
      className={`${className ? className : ''} ${inputs['textarea-Outlined']}`}
    >
      {label && <label htmlFor={id}>{label}</label>}
      <textarea onChange={onChange} placeholder={placeholder} id={id}>
        {value}
      </textarea>
    </div>
  )
}

export function CountingComponent({
  className,
  value: count,
  onChange,
  footer,
  min = 0,
  max = 9999999999999
}) {
  return (
    <>
      <div
        className={`${className ? className : ''} ${inputs['counting-input']}`}
      >
        <button
          type="button"
          onClick={() => count > min && onChange(Number(count) - 1)}
        >
          -
        </button>
        <input
          type="number"
          value={count}
          onBlur={(e) =>
            e.target.value < min
              ? onChange(Number(min))
              : e.target.value > max
              ? onChange(Number(max))
              : onChange(Number(e.target.value || 0))
          }
          onChange={(event) =>
            event.target.value >= min &&
            onChange(
              event.target.value === '' ? '' : Number(event.target.value)
            )
          }
        />
        <button
          type="button"
          onClick={() =>
            max
              ? count < max && onChange(Number(count) + 1)
              : onChange(Number(count) + 1)
          }
        >
          +
        </button>
      </div>
      {footer && <h6 className={inputs['counting-input__footer']}>{footer}</h6>}
    </>
  )
}
