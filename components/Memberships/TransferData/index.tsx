import { useState } from 'react'
import style from '@style/userPremium.module.css'
import TransferDataModal from './Modal'
import strings from '@script/locale'
import { useRouter } from 'next/router'

export default function TransferData({
  disabled = false
}: {
  disabled?: boolean
}) {
  const router = useRouter()
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)

  const redirectToMembership = () => {
    router.push('/memberships')
  }

  return (
    <>
      {openModal && <TransferDataModal {...{ openModal, setOpenModal }} />}

      <div className={style.transfer__wrapper}>
        <div className={style['transfer__title-description']}>
          <h2 className={disabled ? 'tw-cursor-default tw-opacity-50' : ''}>
            {strings.membership_transfer_title}
          </h2>
          <p className={disabled ? 'tw-cursor-default tw-opacity-50' : ''}>
            {strings.membership_transfer_description}
          </p>
        </div>
        <button
          className={
            disabled ? style.upgradeButton : style['membership__button']
          }
          onClick={disabled ? redirectToMembership : handleOpenModal}
        >
          {disabled ? strings.upgrade : strings.membership_transfer_start}
        </button>
      </div>
    </>
  )
}
