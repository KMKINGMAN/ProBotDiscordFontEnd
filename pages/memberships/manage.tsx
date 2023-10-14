import ManagePremiumLayout from '@component/Memberships/Manage'
import { Context } from '@script/_context'
import { useRouter } from 'next/router'
import * as React from 'react'

export default function ManagePremium() {
  const router = useRouter()
  const { user } = React.useContext(Context)

  if (!user.membership_tier) {
    router.push('/memberships')

    return null
  }
  return <ManagePremiumLayout />
}
