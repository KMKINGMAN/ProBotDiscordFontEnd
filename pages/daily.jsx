/* eslint-disable indent */
import { useState, useContext, useEffect, useRef } from 'react'
import { Context } from '@script/_context'
import strings from '@script/locale'
import Turnstile, { useTurnstile } from "react-turnstile";
import axios from 'axios'
import moment from 'moment'
import CountUp from 'react-countup'
import Link from 'next/link'
import Head from 'next/head'
import Streak from '@component/Streaks'
import { useROnboarding } from 'r-onboarding'
import DailyOnboardingWrapper from '@component/DailyOnboardingWrapper'
import { SHA256, enc } from 'crypto-js';

export default function Daily() {
  const { user, updateUser, auth } = useContext(Context)
  const DAILY_ONBOARDING_STEPS = [
    {
      attachTo: { element: '#daily-streak' },
      content: {
        title: strings.daily_onboarding_head || 'Double your rewards!',
        description:
          strings.daily_onboarding_text ||
          'Build your streak and double your rewards by claiming your daily reward every day!"'
      }
    }
  ]
  const wrapperRef = useRef(null)
  const { start, finish } = useROnboarding(wrapperRef)
  const turnstile = useTurnstile();

  const [state, setStates] = useState({
    claimed: false,
    error: false,
    message: '',
    ReCAPTCHA: false,
    redirect: false,
    style: false
  })
  const [streaks, setStreaks] = useState([])
  const [isMobile, changeIsMobile] = useState(false)
  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }))

  useEffect(() => {
    window.addEventListener('resize', () => {
      changeIsMobile(Boolean(window.innerWidth <= 625))
    })

    return () => {
      window.removeEventListener('resize', () => {
        changeIsMobile(Boolean(window.innerWidth <= 625))
      })
    }
  }, [])

  const getStreaks = async () => {
    try {
      const { data } = await axios.get('/user/streaks')
      setStreaks(data)

      if (!localStorage.getItem('onboarding')) {
        localStorage.setItem('onboarding', true)
        start()
      } else {
        finish()
      }
    } catch (error) {
      console.log(error, 'error here !!')
    }
  }

  useEffect(() => {
    if (!user) return

    if (moment(user?.next_daily).toDate().getTime() > new Date().getTime()) {
      setState({ claimed: true })
    }
    getStreaks()
  }, [user])

  async function claimReward(captcha) {
    const d = new Date().toISOString()
    
    const response = await axios
      .post('/claim_daily', { captcha, d, c: SHA256(`Backlands-Magnetize2-Parkway${user?.id}${d}`).toString(enc.Hex) })
      .catch((error) => error.response)

    if (response.data.success) {
      await updateUser()

      setState({
        message: `You got ${response.data.success} credits`,
        style: true,
        claimed: true,
        ReCAPTCHA: false
      })
      return undefined
    }
    const handleError = {
      1: strings.daily_disable_vpn,
      2: strings.cant_use_multi_devices,
      400: strings.daily_wrong_captcha,
      401: strings.daily_wrong_token,
      429: strings.daily_already_claimed,
      500: strings.daily_server_error,
      403: strings.daily_forbidden,
      1005: strings.daily_refresh_page
    }
    setState({
      message:
        handleError[String(response.data.error)] ||
        strings.store_error_contact_support,
      claimed: true,
      error: true,
      ReCAPTCHA: false
    });
    turnstile.reset();
    if ([401, 403].includes(response.data.error)) auth()
  }

  useEffect(() => {
    window.ezstandalone = window.ezstandalone || {};
    ezstandalone.cmd = ezstandalone.cmd || [];
    ezstandalone.cmd.push(function() {
      if (!ezstandalone.enabled) {
        ezstandalone.define(102,103,104);
        ezstandalone.enable();
      } else {
        ezstandalone.refresh();
      }
    });

  }, [])

  return (
    <>
      <Head>
        <title>
          {strings.daily} - {strings.probot}
        </title>
      </Head>
      {/* <div className="emoji-alert-box mt-35 mb-20">
        <img src="/images/emoji/character.png" alt="probot character" />
        <div>
          <h3>Did you know?</h3>
          <div className="d-flex gap-1">
            <p>
              You can get more daily credits 
            </p>
            <Link href="/memberships">subscribe now</Link>
          </div>
        </div>
      </div> */}
      <DailyOnboardingWrapper
        steps={DAILY_ONBOARDING_STEPS}
        wrapperRef={wrapperRef}
      />
      <div
        className={`daily-parent${
          state.claimed ? ' daily-parent-claimed' : ''
        }${state.error ? ' daily-multiple-devices' : ''}${
          state.style ? ' daily-claimed-style' : ''
        }`}
        style={{
          margin:
            !user && isMobile
              ? '4rem 1rem 1rem 1rem'
              : user
              ? ''
              : '4rem auto auto auto'
        }}
      >
        {state.error && (
          <div id="daily-multiple-devices-div">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>{state.message}</h3>
          </div>
        )}
        <div
          style={{
            opacity: state.error ? '0.2' : '1',
            pointerEvents: state.style || state.error ? 'none' : 'all'
          }}
        >
          <div className="text-header">
            <h2>{strings.daily}</h2>
            <div className="text-mute d-flex justify-content-center align-items-center gap-1">
              {strings.daily_come_back ||
                'Come back everyday to earn extra credits!'}
              <div
                onClick={() => {
                  start()
                }}
                className="pointer d-flex"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.4"
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    fill="var(--purple)"
                  />
                  <path
                    d="M12 13.75C12.41 13.75 12.75 13.41 12.75 13V8C12.75 7.59 12.41 7.25 12 7.25C11.59 7.25 11.25 7.59 11.25 8V13C11.25 13.41 11.59 13.75 12 13.75Z"
                    fill="var(--purple)"
                  />
                  <path
                    d="M12.92 15.6199C12.87 15.4999 12.8 15.3899 12.71 15.2899C12.61 15.1999 12.5 15.1299 12.38 15.0799C12.14 14.9799 11.86 14.9799 11.62 15.0799C11.5 15.1299 11.39 15.1999 11.29 15.2899C11.2 15.3899 11.13 15.4999 11.08 15.6199C11.03 15.7399 11 15.8699 11 15.9999C11 16.1299 11.03 16.2599 11.08 16.3799C11.13 16.5099 11.2 16.6099 11.29 16.7099C11.39 16.7999 11.5 16.8699 11.62 16.9199C11.74 16.9699 11.87 16.9999 12 16.9999C12.13 16.9999 12.26 16.9699 12.38 16.9199C12.5 16.8699 12.61 16.7999 12.71 16.7099C12.8 16.6099 12.87 16.5099 12.92 16.3799C12.97 16.2599 13 16.1299 13 15.9999C13 15.8699 12.97 15.7399 12.92 15.6199Z"
                    fill="var(--purple)"
                  />
                </svg>
              </div>
            </div>
          </div>

          {user && (
            <>
              <hr />
              <Streak id="daily-streak" streaks={streaks} />
              <hr />
            </>
          )}

          {state.ReCAPTCHA ? (
            <div
              className="center d-flex justify-content-center mt-25"
              style={{ display: 'inline-block' }}
            >
              <Turnstile
                sitekey="0x4AAAAAAAKvJSvkwmexkeMa"
                onVerify={claimReward}
                theme="dark"
                language={strings.getLanguage()}
                action='daily'
                cData={user.id}
              />
            </div>
          ) : (
            <div
              className="daily-logo-text"
              onClick={() => (!user ? auth() : setState({ ReCAPTCHA: true }))}
            >
              {state.style ? (
                <i className="fas fa-check-circle"></i>
              ) : (
                <i className="fas fa-gift"></i>
              )}
            </div>
          )}

          {(state.claimed || state.style) && (
            <h5 id="daily-time-left" className="mt-20">
              {strings.mod_time_left}{' '}
              <Countdown
                endDate={moment.utc(user?.next_daily).toDate()}
                deleteAction={() => {
                  setState({ claimed: false })
                }}
              />
            </h5>
          )}
          <div className="daily-footer">
            <div className="daily-number">
              {state.claimed || state.style
                ? strings.formatString(
                    strings.claimed_last_daily,
                    <div dir="ltr" className="d-flex align-items-center">
                      <i className="fa-solid fa-cedi-sign"></i>
                      <CountUp end={user?.daily_last_claim} duration={1.5} />
                    </div>
                  )
                : strings.formatString(
                    strings.daily_get_upto,
                    <div dir="ltr" className="d-flex align-items-center">
                      <i className="fa-solid fa-cedi-sign"></i>
                      <CountUp end={3000} duration={1.5} />
                    </div>
                  )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <div id="ezoic-pub-ad-placeholder-104"> </div>
      </div>

      <footer
        className="mt-55"
        style={{ textAlign: 'center', position: 'relative' }}
      >
        <div className="center footerbulitin">
          <Link href="/terms-of-use">{strings.tos_title}</Link>-
          <Link href="/privacy-policy">{strings.pp_title}</Link>-
          <Link href="/refund-policy">{strings.rp_title}</Link>
        </div>
        <p className="mt-2">
          {strings.formatString(strings.rights, new Date().getFullYear())}
        </p>
      </footer>
    </>
  )
}

function Countdown({ onEnd, endDate, deleteAction }) {
  const [state, setState] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment()
      const duration = moment.duration(endDate - now)
      const hours = duration.hours()
      const minutes = duration.minutes()
      const seconds = duration.seconds()

      if (hours === 0 && minutes === 0 && seconds === 0) {
        onEnd()
        deleteAction()
        clearInterval(interval)
      }

      setState({ hours, minutes, seconds })

      return () => clearInterval(interval)
    }, 1000)
  }, [])

  return (
    <span>
      {`
        ${state.hours < 10 ? `0${state.hours}` : state.hours}:${
        state.minutes < 10 ? `0${state.minutes}` : state.minutes
      }:${state.seconds < 10 ? `0${state.seconds}` : state.seconds}
      `}
    </span>
  )
}
