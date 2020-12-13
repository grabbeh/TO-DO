import { useState, useEffect } from 'react'
import { server } from 'config/index'

const useDataApi = (initialEndpoint, initialValue, initialData) => {
  const [data, setData] = useState(initialData)
  const [values, setValue] = useState(initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    const fetchData = async () => {
      if (values) {
        setLoading(true)
        setError(false)
        fetch(`${server}${initialEndpoint}`, {
          body: JSON.stringify(values),
          method: 'POST'
        })
          .then(response => {
            if (response.status === 200) {
              return Promise.resolve(response.json()) // This will end up in SUCCESS part
            }
            return Promise.resolve(response.json()).then(responseInJson => {
              return Promise.reject(responseInJson.errorMessage) //  responseInJson.message = "Some nasty error message!"
            })
          })
          .then(
            result => {
              setData(result)
              setLoading(false)
            },
            error => {
              setError(error)
            }
          )
          .catch(catchError => {
            setError(catchError)
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }

    fetchData()
  }, [values])

  return [{ data, loading, error }, setValue]
}

export default useDataApi
