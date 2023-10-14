import Switch from 'react-switch'

import style from '@style/userPremium.module.css'
import strings from '../../scripts/locale'
import { Context } from '@script/_context'
import { useContext } from 'react'

const UserPlansSwitcher = ({ plan, setPlan }) => {
  const { rtl } = useContext(Context)

  return (
    <div className={`${style.plan_converter} ${rtl ? style.rtl : ''}`}>
      <span
        status={plan === 'yearly' ? 'in-active' : 'active'}
        onClick={() => setPlan('monthly')}
      >
        {strings.monthly}
      </span>
      <Switch
        checked={plan === 'yearly'}
        onChange={(boolean) => setPlan(boolean ? 'yearly' : 'monthly')}
        onColor="#1F1F25"
        offColor="#1F1F25"
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        className={rtl ? style.switch_rtl : ''}
        id="material-switch"
        width={60}
        handleDiameter={19}
        height={32}
      />
      <span
        discount-amount="50% OFF"
        status={plan === 'yearly' ? 'active' : 'in-active'}
        onClick={() => setPlan('yearly')}
      >
        {strings.yearly}
      </span>
    </div>
  )
}

export default UserPlansSwitcher
