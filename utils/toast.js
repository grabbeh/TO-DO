import toast from 'react-hot-toast'

const activateToast = (
  mutation,
  successMessage,
  loadingMessage = 'Loading',
  errorMessage = 'This happened'
) => {
  toast.promise(mutation, {
    loading: loadingMessage,
    success: data => successMessage,
    error: err => `${errorMessage} ${err.toString()}`
  })
}

export default activateToast
