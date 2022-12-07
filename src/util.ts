export const downloadFile = (url: string, name?: string) => {
  const link = document.createElement('a')
  link.download = name || ''
  link.target = '_blank'
  link.style.display = 'none'
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
export const sleep = (s?: number) => {
  return new Promise(rs => {
    setTimeout(() => {
      rs(void 0)
    }, s || 100)
  })
}
export const formatTimestamp = (timestamp: number)=> {
  let date = new Date(timestamp)
  const len = timestamp.toString().length
  if (len < 13) {
      let sub = 13 - len
      sub = 10**sub
      date = new Date(timestamp * sub)
  }
  const y = `${date.getFullYear()  }-`
  let M: any = date.getMonth() + 1
  M = `${M < 10 ? `0${  M}` : M  }-`
  let d: any = date.getDate()
  d = `${d < 10 ? `0${  d}` : d  } `
  let h: any = date.getHours()
  h = `${h < 10 ? `0${  h}` : h  }:`
  let m: any = date.getMinutes()
  m = `${m < 10 ? `0${  m}` : m  }:`
  let s: any = date.getSeconds()
  s = s < 10 ? `0${  s}` : s
  return y + M + d + h + m + s
}