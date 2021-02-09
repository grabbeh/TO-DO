import Modal from 'react-modal'
import { useState } from 'react'
import { OptionsModal } from './index'
import { Cog } from './icons/index'

const OptionsBox = ({ todo }) => {
  const [modalIsOpen, setIsOpen] = useState(false)
  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }
  return (
    <div className='static'>
      <div onClick={openModal}>
        <div className='flex hover:text-blue-800 text-blue-500'>
          <div className='h-5 w-5'>
            <Cog />
          </div>
        </div>
      </div>
      <Modal
        className='bg-white outline-none inset-x-0 bottom-0 m-auto absolute w-full rounded-t-lg lg:w-2/5 border-2 px-2'
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Example Modal'
        closeTimeoutMS={500}
      >
        <OptionsModal closeModal={closeModal} todo={todo} />
      </Modal>
    </div>
  )
}

export default OptionsBox
