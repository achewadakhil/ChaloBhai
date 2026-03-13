export default function getApiErrorMessage(error, fallbackMessage = 'Something went wrong. Please try again.') {
  const responseData = error?.response?.data

  if (responseData?.message) {
    return responseData.message
  }

  if (responseData?.detail) {
    return responseData.detail
  }

  if (responseData?.errors) {
    const firstError = Object.values(responseData.errors)[0]
    if (firstError) {
      return firstError
    }
  }

  return fallbackMessage
}
