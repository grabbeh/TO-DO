import 'tailwindcss/tailwind.css'
import 'react-reflex/styles.css'
import '../index.css'
import Modal from 'react-modal'

Modal.setAppElement('body')

export default function MyApp ({ Component, pageProps }) {
  return <Component {...pageProps} />
}
