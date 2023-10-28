import strings from '@script/locale'
import React, { useContext, useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import Modal from 'react-modal'
import CheckoutComForm from '../../components/premium/method_checkout'
import { Context } from '@script/_context'
import axios from 'axios'
import Approved from './status_approved'
import Declined from './status_declined'
import CouponCode from './CouponCode'
import FollowPopup from './status_follow_popup'
import Loading from '../loader'
import moment from 'moment'
import { shop } from '@script/constants'

function Summary({ data, setOpen, sub }) {
  const router = useRouter()
  const { guild_id } = router.query
  const [openType, setOpenType] = useState('saved')
  const [resposive, setResponsive] = useState(false)
  const [processing, processPayment] = useState(false)
  const [paymentdata, paymentData] = useState(false)
  const [CVV, setCVV] = useState('')
  const checkoutForm = useRef(null)
  const { user, methods, Toast, updateUser } = useContext(Context)
  const [couponDiscount, setCouponDiscount] = useState({
    discount: undefined,
    code: ''
  })
  const [openedPopup, openPopup] = useState(false)

  const getUpgradePrice = () => {
    let vat = 0
    let price
    if (sub.end) {
      price = parseFloat(
        moment(sub.end).diff(moment(), 'days') > 90
          ? (moment(sub.end).diff(moment(), 'days') * 0.083).toFixed(2)
          : (moment(sub.end).diff(moment(), 'days') * 0.169).toFixed(2)
      )
    } else if (user.membership_tier) {
      const period =
        moment(user.membership_end).diff(moment(), 'days') > 90 ? '2' : '1'
      const oldPrice = shop.find((i) => i.id === user.membership_tier)?.price[
        period
      ]
      const upgradePrice = shop.find((i) => i.id === data.item)?.price[period]
      if (!oldPrice || !upgradePrice)
        return Toast.fire({ icon: 'error', message: 'Upgrade price not found' })

      price = parseFloat(
        period === '2'
          ? (
              moment(user.membership_end).diff(moment(), 'days') *
              (upgradePrice / 365 - oldPrice / 365)
            ).toFixed(2)
          : (
              moment(user.membership_end).diff(moment(), 'days') *
              (upgradePrice / 30 - oldPrice / 30)
            ).toFixed(2)
      )
    }

    if (user.country === 'SA') {
      price = (price * 1.15).toFixed(2)
      vat = (price * 0.15).toFixed(2)
    }
    return price < 1 ? 1 : couponDiscount.discount || price
  }

  const initPrice = couponDiscount.discount || data.price
  let price = data.period === 2 ? initPrice * 12 : initPrice
  let total = data.period === 2 ? initPrice * 12 : initPrice
  let vat = 0
  if (user.country === 'SA' && data.type !== 'recharge') {
    total = price * 1.15
    vat = price * 0.15
  }
  useEffect(() => {
    if (openedPopup && !paymentdata.approved)
      paymentData({ approved: false, response_summary: null })
  }, [openedPopup])

  const onPaymentMessage = (event) => {
    if (event.data?.type === 'checkout_payment') {
      paymentData(event.data)
    }
  }

  const paymentMethodIcon = (scheme) => {
    switch (scheme.toLowerCase()) {
      case 'visa':
        return 'fa-brands fa-cc-visa'
      case 'mastercard':
        return 'fa-brands fa-cc-mastercard'
      case 'dinersclub':
        return 'fa-brands fa-cc-diners-club'
      case 'jcb':
        return 'fa-brands fa-cc-jcb'
      case 'discover':
        return 'fa-brands fa-cc-discover'
      case 'amex':
        return 'fa-brands fa-cc-amex'
      default:
        return 'fas fa-credit-card'
    }
  }

  useEffect(() => {
    window.addEventListener('message', onPaymentMessage)
    return () => window.removeEventListener('message', onPaymentMessage)
  }, [onPaymentMessage])

  useEffect(() => {
    if (!paymentdata) return
    if (paymentdata.redirect && !paymentdata.iframe) {
      // popup
      let w = 1000
      let h = 800
      // Fixes dual-screen position                         Most browsers      Firefox
      let dualScreenLeft =
        window.screenLeft !== undefined ? window.screenLeft : window.screenX
      let dualScreenTop =
        window.screenTop !== undefined ? window.screenTop : window.screenY

      let width = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : window.screen.width
      let height = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : window.screen.height
      let left = width / 2 - w / 2 + dualScreenLeft
      let top = height / 2 - h / 2 + dualScreenTop

      let popup = window.open(
        paymentdata.redirect,
        '_blank',
        'scrollbars=yes, width=' +
          w +
          ', height=' +
          h +
          ', top=' +
          top +
          ', left=' +
          left
      )
      if (popup == null || typeof popup == 'undefined') {
        window.location = paymentdata.redirect
        return
      }
      // Puts focus on the
      if (window.focus) {
        popup.focus()
      }

      // detect popup close
      let popupTick = setInterval(() => {
        if (popup.closed) {
          clearInterval(popupTick)
          openPopup(true)
        }
      }, 500)

      // end popup
    }
    if (paymentdata.approved) {
      updateUser()
      setTimeout(() => {
        if (guild_id) {
          router.push(`/server/${guild_id}/premium/manage`)
        }
        if ([1001, 1002, 1003].includes(data.item)) {
          router.push(`/memberships/manage`)
        } else {
          router.push(`/premium/manage`)
        }
        setOpen(false)
      }, 3000)
    }
  }, [paymentdata])
  if (paymentdata)
    return (
      <div className="center">
        {paymentdata.approved ? (
          <Approved />
        ) : paymentdata.redirect && paymentdata.iframe ? (
          <div>
            <iframe
              src={paymentdata.redirect}
              width="600px"
              height="400px"
              id="myId"
              className="dsframe"
              display="initial"
              position="relative"
              frameBorder="0"
            />
          </div>
        ) : paymentdata.redirect ? (
          <FollowPopup />
        ) : (
          <Declined payment={paymentdata} />
        )}
      </div>
    )

  if (processing)
    return (
      <div className="checkout-loading">
        <Loading />
      </div>
    )

  return (
    <div className="d-flex flex-md-row pay__items flex-column bg-gray-4 justify-content-between w-100 gap-2">
      <div
        className={`w-60 min-h-30 pb-3 ${
          resposive === true ? `responsive__hide` : ``
        } full-width__select pt-4`}
        style={{ paddingLeft: '1.4rem', paddingRight: '1rem' }}
      >
        <h6 className="checkout__title">{strings.premium_checkout}</h6>
        <div>
          <p className="mt-25 payment_m_title">{strings.payment_methods}</p>
          <div
            className="form-group premium-type-radios-parent"
            style={{ marginTop: '-9px' }}
          >
            {data.item !== 5 && (
              <div
                className={
                  openType === 'balance' ? 'premium-radio-input__active' : ''
                }
                onClick={() => setOpenType('balance')}
              >
                <label className="container d-flex align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <i className="fa-solid fa-wallet"></i>
                    <span>
                      {strings.formatString(
                        strings.billing_account_balance,
                        user.balance
                      )}
                    </span>
                  </div>
                </label>
              </div>
            )}
            {![5, 1001, 1002, 1003].includes(data.item) &&
              user.credits > 10000 && (
                <div
                  className={
                    openType === 'credits' ? 'premium-radio-input__active' : ''
                  }
                  onClick={() => setOpenType('credits')}
                >
                  <label className="container d-flex align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <i className="fa-solid fa-money-bill"></i>
                      <span>
                        {strings.billing_pay_credits} (
                        <i className="fa-solid fa-cedi-sign"></i>{' '}
                        {user.credits
                          .toFixed()
                          ?.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                        )
                      </span>
                    </div>
                  </label>
                </div>
              )}

            <div
              className={
                openType === 'add_cc' ? 'premium-radio-input__active' : ''
              }
              onClick={() => setOpenType('add_cc')}
            >
              <label className="container d-flex align-items-center">
                <div className="d-flex align-items-center gap-2">
                  {openType === 'add_cc' ? (
                    <></>
                  ) : (
                    <>
                      <i className="fas fa-credit-card"></i>
                      <span>{strings.premium_new_cc}</span>
                    </>
                  )}
                </div>
              </label>

              {openType === 'add_cc' && (
                <div>
                  <CheckoutComForm
                    processing={processing}
                    processPayment={processPayment}
                    paymentdata={paymentdata}
                    paymentData={paymentData}
                    checkoutForm={checkoutForm}
                    data={data}
                    coupon={
                      couponDiscount.discount ? couponDiscount.code : undefined
                    }
                  />
                </div>
              )}
            </div>

            {![1001, 1002, 1003].includes(data.item) && (
              <div
                className={
                  openType === 'paypal' ? 'premium-radio-input__active' : ''
                }
                onClick={() => setOpenType('paypal')}
              >
                <label className="container d-flex align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <i className="fa-brands fa-cc-paypal"></i>
                    <span>PayPal</span>
                  </div>
                </label>
              </div>
            )}
            {methods?.map((method, i) => (
              <div
                key={i}
                className={
                  openType === method.id ? 'premium-radio-input__active' : ''
                }
                onClick={() => {
                  setOpenType(method.id)
                  setCVV('')
                }}
              >
                <label className="container d-flex align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <i
                      className={paymentMethodIcon(method.scheme)}
                      data-inline="false"
                    ></i>
                    <span>
                      {strings.formatString(
                        strings.cc_ends_with,
                        method.scheme,
                        method.last4
                      )}
                    </span>
                  </div>
                  <p>
                    {strings.billing_card_expiry_date} {method.expiry_month}/
                    {method.expiry_year}
                  </p>
                </label>
                {openType === method.id ? (
                  <div className="mt-15 ms-3">
                    {strings.billing_card_security_code}
                    <input
                      id="cvv"
                      name="cvv"
                      value={CVV}
                      className="form-control cvv-check ms-3"
                      placeholder="CVV"
                      type="number"
                      onChange={(e) => {
                        if (e.target.value.length <= 4) setCVV(e.target.value)
                      }}
                      maxLength={3}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 buttons__checkout">
          <button
            className="btn btn-secondary pay-button"
            onClick={() => setResponsive(true)}
          >
            {strings.continue}
          </button>
          <button
            className="btn pay-button btn_outline_checkout"
            onClick={() => setOpen(false)}
          >
            {strings.back}
          </button>
        </div>
      </div>
      <div
        className={`d-flex flex-column ${
          resposive === false ? `responsive__hide` : ``
        } justify-content-between review__container align-self-start w-40 full-width__select`}
      >
        <div>
          <p className="mt-35 payment_m_title text-uppercase">
            {strings.review}
          </p>
          <div className="review__component d-flex">
            <div className="flex-1">
              <h6 className="low_opacity_text">
                {strings.transactions_amount}
              </h6>
              {openType !== 'credits' && (
                <h6 className="low_opacity_text">{strings.vat}</h6>
              )}
              <h6 className="high_opacity_text" style={{ marginTop: '.9rem' }}>
                {strings.total}
              </h6>
            </div>
            <div>
              {data.type === 'upgrade' ? (
                <>
                  <span className={'previous-price'}>
                    {openType === 'credits' ? (
                      <>
                        <i className="fa-solid fa-cedi-sign"></i>{' '}
                        {String(getUpgradePrice() * 200000).replace(
                          /(\d)(?=(\d{3})+(?!\d))/g,
                          '$1,'
                        )}
                      </>
                    ) : (
                      <>${getUpgradePrice()}</>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <div className="d-flex flex-warp gap-2 align-items-baseline">
                    <span
                      className={
                        couponDiscount.discount >= 0
                          ? 'previous-price'
                          : 'checkout-price low_opacity_text'
                      }
                    >
                      {openType === 'credits' ? (
                        <>
                          <i className="fa-solid fa-cedi-sign"></i>{' '}
                          {String(price * 200000).replace(
                            /(\d)(?=(\d{3})+(?!\d))/g,
                            '$1,'
                          )}
                        </>
                      ) : (
                        `$${price.toFixed(2)}`
                      )}
                    </span>
                    {couponDiscount.discount >= 0 && (
                      <div className="d-flex align-items-end">
                        <span
                          style={{
                            fontSize: '1rem',
                            marginBottom: '0',
                            display: 'block'
                          }}
                        >
                          {openType === 'credits' ? (
                            <div className="d-flex">
                              <i
                                className="fa-solid fa-cedi-sign"
                                style={{
                                  paddingTop: '0.5rem',
                                  marginInlineEnd: '5px'
                                }}
                              ></i>{' '}
                              <div>
                                {String(
                                  couponDiscount.discount * 200000
                                ).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                              </div>
                            </div>
                          ) : (
                            <>${couponDiscount.discount}</>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
              {data.type === 'upgrade' ? (
                <>
                  <span
                    className={
                      couponDiscount.discount >= 0
                        ? 'previous-price'
                        : 'checkout-price'
                    }
                  >
                    {openType === 'credits' ? (
                      <>
                        <i className="fa-solid fa-cedi-sign"></i>{' '}
                        {String(getUpgradePrice() * 200000).replace(
                          /(\d)(?=(\d{3})+(?!\d))/g,
                          '$1,'
                        )}
                      </>
                    ) : (
                      <>${getUpgradePrice()}</>
                    )}
                  </span>
                  {couponDiscount.discount >= 0 && (
                    <>
                      <span style={{ fontSize: '1rem', marginBottom: '0' }}>
                        {openType === 'credits' ? (
                          <>
                            <i className="fa-solid fa-cedi-sign"></i>{' '}
                            {String(couponDiscount.discount * 200000).replace(
                              /(\d)(?=(\d{3})+(?!\d))/g,
                              '$1,'
                            )}
                          </>
                        ) : (
                          <>${couponDiscount.discount}</>
                        )}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>
                  {openType !== 'credits' && (
                    <span
                      className={
                        couponDiscount.discount >= 0
                          ? 'previous-price'
                          : 'checkout-price low_opacity_text'
                      }
                    >
                      ${vat.toFixed(2) || '0.00'}
                    </span>
                  )}
                  <div className="d-flex flex-warp gap-2 align-items-baseline">
                    <span
                      className={
                        couponDiscount.discount >= 0
                          ? 'previous-price'
                          : 'checkout-price high_opacity_text'
                      }
                    >
                      {openType === 'credits' ? (
                        <>
                          <i className="fa-solid fa-cedi-sign"></i>{' '}
                          {String(price * 200000).replace(
                            /(\d)(?=(\d{3})+(?!\d))/g,
                            '$1,'
                          )}
                        </>
                      ) : (
                        `$${total.toFixed(2)}`
                      )}
                    </span>
                    {couponDiscount.discount >= 0 && (
                      <div className="d-flex align-items-end">
                        <span
                          style={{
                            fontSize: '1rem',
                            marginBottom: '0',
                            display: 'block'
                          }}
                        >
                          {openType === 'credits' ? (
                            <div className="d-flex">
                              <i
                                className="fa-solid fa-cedi-sign"
                                style={{
                                  paddingTop: '0.5rem',
                                  marginInlineEnd: '5px'
                                }}
                              ></i>{' '}
                              <div>
                                {String(
                                  couponDiscount.discount * 200000
                                ).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                              </div>
                            </div>
                          ) : (
                            <>${couponDiscount.discount}</>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          {data.item !== 5 && (
            <CouponCode
              couponDiscount={couponDiscount}
              setCouponDiscount={setCouponDiscount}
              amount={data.type === 'upgrade' ? getUpgradePrice() : price}
            />
          )}
        </div>
        <div className="full-width">
          <button
            id="pay-button"
            className="btn btn-secondary pay-button"
            onClick={() => {
              if (openType === 'add_cc') return
              if (['balance', 'credits'].includes(openType)) {
                if (
                  (openType === 'balance' &&
                    user.balance <
                      (data.type === 'upgrade' ? getUpgradePrice() : price)) ||
                  (openType === 'credits' &&
                    user.credits <
                      (data.type === 'upgrade' ? getUpgradePrice() : price) *
                        200000)
                )
                  return Toast.fire({
                    icon: 'error',
                    title: strings.premium_dont_have_balance
                  })
                processPayment(true)
                axios
                  .post(`/billing/checkout`, {
                    items: [data],
                    coupon: couponDiscount.discount
                      ? couponDiscount.code
                      : undefined,
                    event: { scheme: openType, token: openType }
                  })
                  .then((response) => {
                    console.log(typeof response.data, response.data)
                    paymentData(response.data)
                    processPayment(false)
                  })
                return
              }
              if (openType === 'paypal') {
                processPayment(true)
                axios
                  .post(`/billing/checkout`, {
                    items: [data],
                    coupon: couponDiscount.discount
                      ? couponDiscount.code
                      : undefined,
                    event: { scheme: 'paypal', token: 'paypal' }
                  })
                  .then((response) => {
                    console.log(typeof response.data, response.data)
                    paymentData(response.data)
                    processPayment(false)
                  })
              }
              let method = methods.find((g) => g.id === openType)
              if (method?.type === 'card') {
                if (!CVV)
                  return Toast.fire({
                    icon: 'error',
                    title: strings.billing_no_cvv
                  })
                processPayment(method.id)
                axios
                  .post(`/billing/checkout`, {
                    items: [data],
                    coupon: couponDiscount.discount
                      ? couponDiscount.code
                      : undefined,
                    id: method.id,
                    cvv: CVV
                  })
                  .then((response) => {
                    console.log(typeof response.data, response.data)
                    paymentData(response.data)
                    processPayment(false)
                  })
              }
            }}
          >
            {strings.premium_checkout}
          </button>
          <button
            className="btn pay-button buttons__checkout btn_outline_checkout"
            onClick={() => setResponsive(false)}
          >
            {strings.back}
          </button>
          <p className="privacy_checkout full-width">
            {strings.formatString(
              strings.billing_by_clicking,
              strings.premium_checkout,
              <a href="/terms-of-use">{strings.tos_title}</a>,
              <a href="/refund-policy">{strings.rp_title}</a>,
              <a href="/privacy-policy">{strings.pp_title}</a>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Checkout({ open, setOpen, sub }) {
  const { rtl } = useContext(Context)

  return (
    <Modal
      isOpen={open}
      className={`smallModal modal__checkout postion-realtive bg-modal bg-command${
        rtl ? 'rtl' : ''
      }`}
      overlayClassName={'ReactModal__Overlay make-scroll-modal pt-20 pb-20'}
      ariaHideApp={false}
      parentSelector={() => document.getElementById('main')}
    >
      <button
        className="btn btn_close_checkout"
        style={{
          right: `${rtl ? '' : 0}`,
          left: `${rtl ? 0 : ''}`
        }}
        onClick={() => setOpen(false)}
      >
        <i className="fas fa-times"></i>
      </button>
      <Summary data={open} setOpen={setOpen} sub={sub} />
    </Modal>
  )
}
