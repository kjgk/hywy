export function getMoneyValue(text) {
  if (typeof(text) === 'string') {
    return parseFloat(text.replace('￥', '').replace('$', '').split(',').join(''))
  }
  return text
}

export function getPercentValue(text) {
  if (typeof(text) === 'string') {
      return parseFloat(text.replace('%', '').split(',').join(''))
  }
  return text
}

export function getTextInitialValue(value) {
  if (value === null || value === undefined) {
    return ''
  } else {
    return value
  }
}