import { Context } from '@script/_context'
import style from '@style/userPremium.module.css'
import { useContext, useState } from 'react'
import Checkout from './checkout'
import strings from '../../scripts/locale'
import Image from 'next/image'

export default function PlanItem({ item, planType }) {
  const { rtl, user } = useContext(Context)
  const [openModal, setOpenModal] = useState(false)

  const handleSubscribe = (event) => {
    event.preventDefault()
    setOpenModal({
      item: item.item,
      type: 'new',
      name: `Membership Tier ${String(item.item).substring(3)}`,
      price: planType === 'yearly' ? item.amount / 2 : item.amount,
      period: planType === 'yearly' ? 2 : 1
    })
  }

  const handleUpgrade = (event) => {
    event.preventDefault()
    setOpenModal({
      item: item.item,
      type: 'upgrade',
      name: `Upgrade Membership to tier ${String(item.item).substring(3)}`,
      price: planType === 'yearly' ? item.amount / 2 : item.amount,
      period: planType === 'yearly' ? 2 : 1
    })
  }

  return (
    <>
      <div
        className={`${style.plan_item} ${rtl ? style.rtl : ''}`}
        special-background-image={item.specialPlan ? 'true' : 'false'}
      >
        <img
          className={style.plan_item__banner}
          src={item.icon}
          alt={item.name}
          style={{ width: '100%' }}
        />
        <div className="tw-flex tw-h-full tw-flex-col tw-justify-between">
          <div className={style.plan_item__body}>
            <h3>{strings[`membership_${item.type}`]}</h3>
            <div className={style.amount__wrapper}>
              <span className={style.amount}>
                ${planType === 'yearly' ? item.amount * 6 : item.amount}
              </span>
              <span className={style.amount__period}>/{strings[planType]}</span>
            </div>
            <p className="tw-text-sm">
              {strings[`membership_${item.type}_description`]}
            </p>
          </div>

          <div className={style.plan_item__actions}>
            <button
              disabled={item.item <= user.membership_tier}
              className={`${style.membership__button} ${
                item.item <= user.membership_tier ? ' tw-opacity-50 ' : ' '
              }`}
              onClick={user.membership_tier ? handleUpgrade : handleSubscribe}
            >
              {user.membership_tier ? strings.upgrade : strings.subscribe}
            </button>
          </div>
        </div>
      </div>
      {openModal && (
        <Checkout open={openModal} setOpen={setOpenModal} sub={openModal} />
      )}
    </>
  )
}
