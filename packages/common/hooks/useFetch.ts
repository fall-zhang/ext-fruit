import { useEffect } from 'react'

export const useFetch = (url:string) => {
  useEffect(() => {
    fetch(url).then(res => {
      res.json()
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.warn(err)
    })
  }, [url])
}
