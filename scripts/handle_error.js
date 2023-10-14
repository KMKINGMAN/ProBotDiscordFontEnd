import strings from '@script/locale'

export function getLocaleError(err) {
  return err.response.data.strings
    ? strings.formatString(
        ...err.response.data.strings.map((s) => strings[s] || s)
      )
    : err.response.data.error
}
