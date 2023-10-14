import * as React from 'react'
import { Context } from '@script/_context'
import style from '@style/userPremium.module.css'
import IUserCurrentPlanProps from './types'
import { useRouter } from 'next/router'
import strings from '@script/locale'
import moment from 'moment'
import debounce from 'lodash/debounce'
import axios from 'axios'

export default function UserCurrentPlan({
  userPlan = 'SILVER'
}: IUserCurrentPlanProps) {
  const router = useRouter()
  const { Toast, rtl, user, setUser } = React.useContext(Context)

  console.log(user)

  const redirectToBilling = () => {
    router.push('/premium/manage#billing')
  }

  const redirectToMembership = () => {
    router.push('/memberships')
  }

  const toggleRenew = React.useCallback(
    debounce(async (bool) => {
      try {
        const { data } = await axios.put('/membership/subscription', {
          autorenew: bool
        })
        if (data.error) {
          throw new Error("Can't toggle renew")
        }
        setUser({
          membership_autorenew: bool
        })
      } catch (error) {
        console.log(error as any, 'error on toggle renew')
        Toast.fire({
          icon: 'error',
          title: 'Error on toggle renew'
        })
      }
    }, 100),
    []
  )

  const LIST_OF_PLANS = {
    SILVER: {
      name: `${strings.membership_silver} ${strings.membership}`,
      description: strings.membership_silver_description,
      coloring: {
        backgroundImage: '/static/checkout/silver-banner.svg',
        backgroundColor: `
        linear-gradient(${
          rtl ? '270deg' : '90deg'
        }, #1F1F25 50%, #AAC9FF 921.57%)
        `,

        borderColor: `linear-gradient(
            ${
              rtl ? '270deg' : '90deg'
            }, rgba(200, 220, 254, 0) 21.24%, rgba(200, 220, 254, 0.24) 126.43%
          ) 1`
      }
    },
    GOLD: {
      name: `${strings.membership_gold} ${strings.membership}`,
      description: strings.membership_gold_description,
      coloring: {
        backgroundImage: '/static/checkout/gold-banner.svg',
        backgroundColor: `
          linear-gradient(${
            rtl ? '270deg' : '90deg'
          }, #1F1F25 50%, #F8BC64 921.57%)
        `,
        borderColor: `linear-gradient(${
          rtl ? '270deg' : '90deg'
        }, rgba(249, 192, 107, 0) 21.24%, rgba(249, 192, 107, 0.24) 126.43%) 1`
      }
    },
    DIAMOND: {
      name: `${strings.membership_diamond} ${strings.membership}`,
      description: strings.membership_diamond_description,
      coloring: {
        backgroundImage: '/static/checkout/diamond-banner.svg',
        backgroundColor: `
        linear-gradient(${
          rtl ? '270deg' : '90deg'
        }, #1F1F25 50%, #38BAFF 921.57%)
        `,
        borderColor: `linear-gradient(${
          rtl ? '270deg' : '90deg'
        }, rgba(56, 186, 255, 0) 21.24%, rgba(56, 186, 255, 0.24) 126.43%) 1`
      }
    }
  }
  const currentPlan = LIST_OF_PLANS[userPlan]

  return (
    <div
      className={style.userCurrentPlanWrapper}
      style={{
        background: currentPlan.coloring.backgroundColor,
        borderImage: currentPlan.coloring.borderColor
      }}
    >
      <div className={`${style.userCurrentPlanContent} tw-gap-8 sm:tw-w-full`}>
        <div className={style.userCurrentPlanText}>
          <h4>{currentPlan.name}</h4>
          <span className={style.subscriptionEnd}>
            {user.membership_autorenew
              ? strings.renews
              : moment(user.membership_end).isBefore()
              ? strings.premium_ended
              : strings.ends}{' '}
            {moment(user.membership_end).startOf('hour').fromNow()} {strings.on}{' '}
            <span>{moment(user.membership_end).format('ll')}</span>
          </span>
        </div>
        <div className="tw-flex tw-flex-row tw-flex-wrap tw-gap-2 sm:tw-w-full">
          {user.membership_tier === 1002 ? (
            <button
              className={`${style.upgradeButton} sm:tw-w-full`}
              onClick={redirectToMembership}
            >
              {strings.upgrade}
            </button>
          ) : null}
          {/* <button
            className={`${style.upgradeButton} sm:tw-w-full`}
            onClick={redirectToMembership}
          >
            {strings.upgrade}
          </button> */}
          <button
            className={`${style.userCurrentPlanButton}  sm:tw-w-full`}
            onClick={() => toggleRenew(!user.membership_autorenew)}
          >
            {user.membership_autorenew
              ? strings.premium_cancel
              : strings.premium_renew_subscription}
          </button>
          <button
            className={`${style.userCurrentPlanTextButton} sm:tw-w-full`}
            onClick={redirectToBilling}
          >
            {strings.billing}
          </button>
        </div>
      </div>
      <img
        className={`${style.userCurrentPlanImage} sm:tw-hidden`}
        src={currentPlan.coloring.backgroundImage}
        alt={currentPlan.name}
      />
    </div>
  )
}
