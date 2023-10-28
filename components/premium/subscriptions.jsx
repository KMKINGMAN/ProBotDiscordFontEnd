import { Context } from '@script/_context'
import axios from 'axios'
import { useState, useContext, useEffect } from 'react'
import strings from '../../scripts/locale'
import moment from 'moment'
import Link from 'next/link'
import ManageCustomBot from './ManageCustomBot'
import Checkout from './checkout'

function Sub({ users, subscription, g, manage, setManage, paymentHistory }) {
  const { user, guild } = useContext(Context)
  const [s, setSub] = useState(subscription)
  const [period, setPeriod] = useState(s?.period)
  const [toRenew, setRenew] = useState(false)
  const [autoRenew, setAutoRenew] = useState(
    s?.autorenew === undefined ? true : s?.autorenew
  )
  const subscriptionUserInfo = users?.find((u) => u.id === subscription.user)

  useEffect(() => {
    setSub(subscription)
  }, [subscription])

  useEffect(() => {
    if (period === s.period && autoRenew === s.autorenew) return

    axios.put('/billing/subscriptions', {
      period,
      autoRenew,
      tier: s.tier,
      id: s.n || s.id
    })
    setSub({ ...subscription, period, autorenew: autoRenew })
  }, [period, autoRenew])

  const invite = (id, tier) => {
    let w = 500
    let h = 750
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

    if (tier === 2) {
      axios.post('/billing/invite', { n: s.n })
      let newWindow = window.open(
        `https://discord.com/oauth2/authorize?client_id=${id}&scope=bot+applications.commands+applications.commands.permissions.update&permissions=2080374975`,
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
      if (window.focus) newWindow.focus()
    }

    if (tier === 1) {
      let newWindow = window.open(
        `https://discord.com/oauth2/authorize?client_id=567703512763334685&scope=bot+applications.commands+applications.commands.permissions.update&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_API_URL}/invite/prime&permissions=2080374975&state=${id}`,
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
      if (window.focus) newWindow.focus()
    }
  }

  const renew = (s) => {
    let sub_id = s.n || s.id

    let oldInvoice = paymentHistory.find(
      (h) => h.status === 2 && h.items[0].sub_id === sub_id
    )
    setRenew({
      orderID: oldInvoice ? oldInvoice._id : undefined,
      sub_id,
      item: s.tier,
      type: 'renew',
      period: s.period,
      price: s.period === 1 ? (s.tier === 1 ? 5 : 10) : s.tier === 1 ? 2.5 : 5
    })
  }

  return (
    <div>
      <div className="black-container premium__container">
        <div
          onClick={() =>
            setManage(manage === (s.id || s.n) ? false : s.id || s.n)
          }
          className={
            manage === (s.id || s.n)
              ? 'row justify-content-md-center gap-1 p-2 pb-3 header__subscription pt-3 border-bottom'
              : 'row header__sub justify-content-md-center pt-3 gap-1 p-2 pb-3'
          }
        >
          <div className="d-flex col-md-4">
            <img
              className="subscription-avatar position-relative"
              src={
                s.tier === 2
                  ? s.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'
                  : '/static/logo.jpg'
              }
            />
            <div className="m-auto ms-3 col">
              <div className="d-flex">
                <h6>
                  {' '}
                  {s.tier === 1 ? 'ProBot Prime' : s?.name || 'premium' + s.n}
                </h6>{' '}
                <div className="ms-2">
                  <span className="badge tier__badge text-uppercase">
                    {strings.premium} {strings.tier} {s.tier}
                  </span>
                </div>{' '}
              </div>
              <div className="text-low-gray premium_bot_info">
                <img
                  className="subscription-bot-avatar"
                  src={
                    g?.icon || 'https://cdn.discordapp.com/embed/avatars/0.png'
                  }
                />{' '}
                <span className="ms-1">
                  {s.guild || s.serverid
                    ? g?.name || strings.unknown
                    : strings.uninvited_subscription}{' '}
                </span>
                <span>• </span>
                {moment().isAfter(s.end)
                  ? strings.premium_ended
                  : `${s.autorenew ? strings.renews : strings.ends} ${moment(
                      s.end
                    )
                      .startOf('hour')
                      .fromNow()}`}
              </div>
            </div>
          </div>
          <div
            className={`col-md ${
              guild && user.id !== subscription.user
                ? ' d-flex justify-content-center'
                : ''
            }`}
          ></div>
          {guild && user.id !== subscription.user ? (
            <></>
          ) : (
            <div className="col m-auto gap-2 mt-2 d-flex justify-content-end">
              <button
                // disabled={guild && user.id !== subscription.user}
                className="btn btn__outlined"
                onClick={(e) => {
                  e.stopPropagation()
                  return renew(s)
                }}
              >
                {strings.renew}
              </button>
              {moment().isBefore(s.end) ? (
                <button
                  style={{ borderRadius: 8, padding: '9px 16px' }}
                  className="btn btn-primary btn-icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    return invite(s.id || s.botid, s.tier)
                  }}
                  // disabled={guild && user.id !== subscription.user}
                >
                  {strings.invite}
                </button>
              ) : null}
              {user.id === subscription.user
                ? s.tier === 1 &&
                  moment(s.end).isAfter() && (
                    <Link
                      onClick={(e) => e.stopPropagation()}
                      href={{
                        pathname: guild.id
                          ? `/server/${guild.id}/premium`
                          : '/premium',
                        query: { upgrade: s.id }
                      }}
                    >
                      <button
                        className="btn btn-primary"
                        style={{ borderRadius: 8, padding: '9px 16px' }}
                      >
                        {strings.upgrade}
                      </button>
                    </Link>
                  )
                : subscriptionUserInfo && (
                    <div
                      className={`subscription-user__info${
                        guild && user.id !== subscription.user
                          ? ' justify-content-center'
                          : ''
                      }`}
                    >
                      <img
                        src={subscriptionUserInfo?.avatar}
                        alt={subscriptionUserInfo?.name}
                      />

                      <span>{`${subscriptionUserInfo?.name}#${subscriptionUserInfo?.discriminator}`}</span>
                    </div>
                  )}
              <div className="line_sperater"></div>
              <button
                className={`btn-arrow mx-1 ${
                  manage === (s.id || s.n) ? 'active' : ''
                }`}
                onClick={() =>
                  setManage(manage === (s.id || s.n) ? false : s.id || s.n)
                }
                // disabled={guild && user.id !== subscription.user}
              >
                {manage === (s.id || s.n) ? (
                  <svg
                    width="13"
                    height="8"
                    viewBox="0 0 13 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.5 7C1.9 6.6 5 3.5 6.5 2L11.5 7"
                      stroke="#70707C"
                      stroke-width="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="13"
                    height="8"
                    viewBox="0 0 13 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.5 1C1.9 1.4 5 4.5 6.5 6L11.5 1"
                      stroke="#70707C"
                      stroke-width="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
        {manage === (s.id || s.n) && (
          <div className="d-flex flex-column pb-3">
            {(!guild ||
              (user.id === subscription.user &&
                subscription.guild === guild.id)) && (
              <>
                <h6 className="mt-20 text-uppercase section__premium__title">
                  {strings.billing_period}
                </h6>
                <div className="manage-cards">
                  <div
                    className={period === 2 ? 'manage-cards--active' : ''}
                    onClick={() => setPeriod(2)}
                  >
                    <div className="checkbox-custom">
                      <svg
                        width="12"
                        height="9"
                        viewBox="0 0 12 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 3.9L4.6 7.5L10.6 1.5"
                          stroke="white"
                          stroke-width="1.5"
                        />
                      </svg>
                    </div>
                    <div className="cards-title">
                      <h3 className="font-16 d-flex gap-2 flex-wrap">
                        <span>{strings.annual_billing}</span>
                        <span className="badge tier__badge tier__badge_low text-uppercase">
                          {strings.premium} {strings.tier} {s.tier}
                        </span>
                        {period === 2 && (
                          <span style={{ color: '#888999', fontSize: 14 }}>
                            ({strings.current_plan})
                          </span>
                        )}
                      </h3>
                      {(!guild || user.id === subscription.user) &&
                        (period === 2 ? (
                          autoRenew ? (
                            <>
                              <button
                                className={
                                  period === 1
                                    ? 'cancel_sub_button'
                                    : 'cancel_sub_button_active'
                                }
                                onClick={() => setAutoRenew(false)}
                              >
                                {strings.premium_cancel}
                              </button>{' '}
                            </>
                          ) : (
                            <>
                              <button
                                className={
                                  period === 1
                                    ? 'cancel_sub_button'
                                    : 'cancel_sub_button_active'
                                }
                                onClick={() => setAutoRenew(true)}
                              >
                                {strings.premium_renew_subscription}
                              </button>{' '}
                            </>
                          )
                        ) : (
                          <>
                            <button
                              className={
                                period === 1
                                  ? 'cancel_sub_button'
                                  : 'cancel_sub_button_active'
                              }
                            >
                              {strings.billing_switch_yearly}
                            </button>{' '}
                          </>
                        ))}
                    </div>
                    <span className="price text-right">
                      {strings.formatString(
                        strings.per_month_billed_yearly,
                        <b>
                          ${s.tier === 1 ? 2.5 : 5}{' '}
                          <strong
                            style={{ fontSize: '12px', color: '#888999' }}
                          >
                            /
                          </strong>{' '}
                        </b>
                      )}
                    </span>
                  </div>
                  <div
                    className={period === 1 ? 'manage-cards--active' : ''}
                    onClick={() => setPeriod(1)}
                  >
                    <div className="checkbox-custom">
                      <svg
                        width="12"
                        height="9"
                        viewBox="0 0 12 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 3.9L4.6 7.5L10.6 1.5"
                          stroke="white"
                          stroke-width="1.5"
                        />
                      </svg>
                    </div>
                    <div className="cards-title">
                      <h3 className="font-16 d-flex gap-2 flex-wrap">
                        <span>{strings.monthly_billing}</span>
                        <span className="badge tier__badge tier__badge_low text-uppercase">
                          {strings.premium} {strings.tier} {s.tier}
                        </span>
                        {period === 1 && (
                          <span style={{ color: '#888999', fontSize: 14 }}>
                            ({strings.current_plan})
                          </span>
                        )}
                      </h3>
                      {(!guild || user.id === subscription.user) &&
                        (period === 1 ? (
                          autoRenew ? (
                            <>
                              <button
                                className={
                                  period === 2
                                    ? 'cancel_sub_button'
                                    : 'cancel_sub_button_active'
                                }
                                onClick={() => setAutoRenew(false)}
                              >
                                {strings.premium_cancel}
                              </button>{' '}
                            </>
                          ) : (
                            <>
                              <button
                                className={
                                  period === 2
                                    ? 'cancel_sub_button'
                                    : 'cancel_sub_button_active'
                                }
                                onClick={() => setAutoRenew(true)}
                              >
                                {strings.premium_renew_subscription}
                              </button>{' '}
                            </>
                          )
                        ) : (
                          <>
                            <button
                              className={
                                period === 2
                                  ? 'cancel_sub_button'
                                  : 'cancel_sub_button_active'
                              }
                            >
                              {strings.billing_switch_monthly}
                            </button>{' '}
                          </>
                        ))}
                    </div>
                    <span className="price text-right">
                      {strings.formatString(
                        strings.per_month_billed_monthly,
                        <b>
                          ${s.tier === 1 ? 5 : 10}{' '}
                          <strong
                            style={{ fontSize: '12px', color: '#888999' }}
                          >
                            /
                          </strong>
                        </b>
                      )}
                    </span>
                  </div>
                </div>
              </>
            )}
            {s.tier > 1 && <ManageCustomBot s={s} setSub={setSub} />}
          </div>
        )}

        {toRenew && <Checkout open={toRenew} setOpen={setRenew} />}
      </div>
    </div>
  )
}

export default function Subscriptions({ subscriptions, paymentHistory }) {
  const { guilds, guild } = useContext(Context)
  const [manage, setManage] = useState(false)
  const [filter, setFilter] = useState(guild?.id || false)
  const [allSubscriptions, setAllSubscriptions] = useState()

  console.log(filter, subscriptions)

  useEffect(() => {
    ;(async () => {
      if (filter === guild.id) return setAllSubscriptions(false)

      try {
        const { data } = await axios.get('/billing/subscriptions')
        setAllSubscriptions(data)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [filter])

  return (
    <>
      <div className="d-flex align-items-center">
        <h3 className="flex-1 mb-0">{strings.subscriptions}</h3>
        <div>
          {guild ? (
            <select
              name="server-embeds"
              id="server-embeds"
              className="form-control form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">{strings.all_subscriptions}</option>
              <option value={guild.id}>{guild.name}</option>
            </select>
          ) : (
            <></>
          )}
        </div>
      </div>
      {[allSubscriptions || subscriptions.data][0].map((s, index) => {
        const g = guilds.find((g) => g.id === s.guild || g.id === s.serverid)
        return (
          <Sub
            users={subscriptions.users}
            key={index}
            manage={manage}
            setManage={setManage}
            subscription={s}
            g={g}
            paymentHistory={paymentHistory}
          />
        )
      })}
      {filter &&
        !subscriptions.data.some(
          (s) => s.guild === guild.id || s.serverid === guild.id
        ) && (
          <h5>
            <i className="fa-solid fa-triangle-exclamation"></i>{' '}
            {strings.premium_someone_else}
          </h5>
        )}

      <Link
        href={guild ? `/server/${guild.id}/premium` : `/premium`}
        legacyBehavior
      >
        <a className="mt-3 btn btn-lg btn-primary">
          <i className="fa-solid fa-cart-shopping"></i>{' '}
          {strings.new_subscription}
        </a>
      </Link>
    </>
  )
}
