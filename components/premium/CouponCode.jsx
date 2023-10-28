import { useState } from 'react'
import axios from 'axios'
import strings from '@script/locale'

export default function CouponCode({
  amount,
  couponDiscount,
  setCouponDiscount
}) {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const initCouponDiscountState = {
    discount: undefined,
    code: ''
  }

  const getAmount = (type, DiscountAmount) => {
    const types = {
      1: amount - amount * (DiscountAmount / 100)
    }

    return types[type]
  }

  const checkCoupon = () => {
    if (couponDiscount.discount >= 0) {
      setCouponDiscount(initCouponDiscountState)

      return
    }

    if (!couponDiscount.code) return setErrorMessage(strings.billing_no_coupon)

    setLoading(true)

    axios
      .get(`/billing/coupons/${encodeURIComponent(couponDiscount.code)}`)
      .then(({ data }) => {
        setLoading(false)
        setCouponDiscount({
          ...couponDiscount,
          discount: getAmount(data.type, data.amount)
        })
        setErrorMessage('')
      })
      .catch(() => {
        setErrorMessage(strings.billing_invalid_coupon)
        setLoading(false)
      })
  }

  return (
    <div className="mt-20">
      <label className="payment_m_title">{strings.billing_coupon_code}</label>
      <form onSubmit={checkCoupon} className="d-flex mt-2 gap-2">
        <input
          id="coupon-code"
          className="form-control"
          placeholder={strings.billing_coupon_code}
          type="text"
          style={{ borderRadius: '4px' }}
          disabled={couponDiscount.discount >= 0}
          value={couponDiscount.code}
          onChange={(e) =>
            setCouponDiscount({
              ...couponDiscount,
              code: e.target.value
            })
          }
        />
        <button
          disabled={loading || !couponDiscount.code}
          style={{ borderRadius: '4px' }}
          className={`btn btn-icon ${
            couponDiscount.discount >= 0 ? 'btn-danger' : 'btn-primary'
          }`}
          onClick={checkCoupon}
        >
          {couponDiscount.discount >= 0 ? (
            <i className="fa-solid fa-circle-minus"></i>
          ) : (
            strings.apply
          )}
          {loading && <span className="spinner-border spinner-border-sm" />}
        </button>
      </form>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
    </div>
  )
}
