import 'tailwindcss/tailwind.css'
import Modal from 'react-modal'

Modal.setAppElement('body')

export default function MyApp ({ Component, pageProps }) {
  return <Component {...pageProps} />
}
