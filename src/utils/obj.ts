export const isBlank = (str: string | undefined | null): boolean => {
  if (str === undefined) {
    return true
  }
  if (str == null) {
    return true
  }
  if (str == '') {
    return true
  }
  if (str == ' ') {
    return true
  }
  if (str.length == 0) {
    return true
  }
  return false
}
