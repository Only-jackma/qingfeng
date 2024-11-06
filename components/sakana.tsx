import {useTheme} from 'next-themes'
import {useEffect} from 'react'
import SakanaWidget from 'sakana-widget'
import 'sakana-widget/lib/index.css'

const Sakana = () => {
  const {theme} = useTheme()

  useEffect(() => {
    new SakanaWidget({
      character: Math.random() < 0.6 ? 'takina' : 'chisato',
      controls: false,
      stroke: {color: theme === 'dark' ? '#333333' : '#e6e6e6'},
    }).setState({ i: 0.001, d: 1 }).mount('#sakana-widget')
  }, [theme])

  return (
    <div id="sakana-widget" className="cursor-pointer bottom-0 left-16 fixed hidden xl:block"/>
  )
}

export default Sakana
