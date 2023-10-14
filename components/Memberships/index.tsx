import * as React from 'react'
import style from '@style/userPremium.module.css'
import UserPlansSwitcher from '@component/premium/UserPlans'
import PlanItem from '@component/premium/PlanItem'
import PlansFeaturesTalbe from '@component/premium/PlansFeaturesTalbe'
import strings from '@script/locale'
import { useContext } from 'react'
import { Context } from '@script/_context'

export const PLANS_DATA = [
  {
    item: 1001,
    icon: '/images/icons/silver.svg',
    amount: 5,
    type: 'silver'
  },
  {
    item: 1002,
    icon: '/images/icons/gold.svg',
    amount: 10,
    type: 'gold'
  },
  {
    item: 1003,
    icon: '/images/icons/diamond.svg',
    amount: 30,
    type: 'diamond'
  }
]

export default function MembershipLayout() {
  const { user } = useContext(Context)
  const [plan, setPlan] = React.useState('yearly')

  return (
    <main className="component-container">
      <header className={`${style.header} tw-gap-2`}>
        <h3 className={`${style.header__title} tw-text-center sm:tw-text-3xl`}>
          {strings.membership_billing_title}
        </h3>
        <p className={style.header__description}>
          {strings.membership_billing_description}
        </p>
      </header>
      <UserPlansSwitcher plan={plan} setPlan={setPlan} />
      <div className={style.plans_container}>
        {PLANS_DATA.map((planData, index) => (
          <PlanItem key={index} item={planData} planType={plan} />
        ))}
      </div>
      <PlansFeaturesTalbe />
    </main>
  )
}
