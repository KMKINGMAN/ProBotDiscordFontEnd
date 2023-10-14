import { useState, useEffect } from 'react'
import UserCurrentPlan from '@component/Memberships/UserCurrentPlan'
import { Context } from '@script/_context'
import { useContext } from 'react'
import style from '@style/userPremium.module.css'
import TransferData from '@component/Memberships/TransferData'
import ChangeBackground from './ChangeBackground'
import axios from 'axios'
import strings from '@script/locale';

export default function ManagePremiumLayout() {
  const { rtl, user } = useContext(Context)
  const wrapperClassName = `${style.managePremiumWrapper} ${
    rtl ? style.rtl : ''
  }`

  const MEMBERSHIP_TIERS = {
    1001: 'SILVER',
    1002: 'GOLD',
    1003: 'DIAMOND'
  }

  return (
    <div className={wrapperClassName}>
      <h2>{strings.membership_manage}</h2>
      <div className={style['manage__wrapper']}>
        <UserCurrentPlan userPlan={MEMBERSHIP_TIERS[user.membership_tier]} />
        <TransferData disabled={![1002, 1003].includes(user.membership_tier)} />
      </div>
      <div className={style['manage__upload-backgrounds']}>
        <h3 className={style['manage__label']}>{strings.membership_background_title}</h3>
        <div className={style['manage__upload-backgrounds__cards-wrapper']}>
          <ChangeBackground type="PROFILE" />
          <ChangeBackground type="ID" />
        </div>
      </div>
    </div>
  )
}
