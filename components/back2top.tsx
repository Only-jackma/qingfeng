import Triangle from './icons/triangle'

import {useEffect, useState} from 'react'

const handleClick = () => {
  window.scrollTo({top: 0, behavior: 'smooth'})
}

const Back2Top = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > window.innerHeight)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (process.env.back2top !== 'true') return <></>

  return (
    <div className="bottom-10 right-10 cursor-pointer fixed hidden lg:block" onClick={handleClick}>
      <Triangle className={`${show ? 'opacity-100' : 'opacity-0'} duration-700 transition-opacity ease-in-out`}/>
    </div>
  )
}

export default Back2Top
