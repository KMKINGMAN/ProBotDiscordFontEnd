import Tooltip from 'rc-tooltip'
import { useState, useEffect } from 'react'
import { Button } from '../Button'
import strings from '@script/locale'
import * as Icons from '../Icons'
import Link from 'next/link'

export default function PricingTable(features: any) {
  const [onScroll, setonScroll] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const navbarState = () => {
    if (window) {
      if (window.scrollY > lastScrollY) {
        setonScroll(false)
      } else {
        setonScroll(true)
      }
      setLastScrollY(window.scrollY)
    }
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', navbarState)
      return () => {
        window.removeEventListener('scroll', navbarState)
      }
    }
  }, [lastScrollY])

  return (
    <div className="tw-relative tw-flex tw-flex-col tw-justify-between tw-gap-16 tw-pb-10 lg:tw-justify-center md:tw-flex-wrap sm:tw-hidden">
      <div className="tw-flex tw-flex-col tw-items-center tw-gap-1">
        <h2 className="landing-headline-sec tw-text-center tw-text-3xl">
          {strings.premium_which_plan_title}
        </h2>
      </div>
      <div className="tw-relative tw-mb-28 tw-flex tw-flex-col tw-justify-between tw-gap-11 tw-pb-10 lg:tw-justify-center md:tw-flex-wrap">
        <div className="tw-z-10">
          <div
            className={`tw-sticky ${
              onScroll ? 'tw-top-20' : 'tw-top-0'
            } tw-top-0 tw-z-30 tw-flex tw-justify-between tw-transition-all tw-duration-200 sm:tw-top-16`}
          >
            <div className="tw-w-full tw-bg-gray-900">{''}</div>
            <div className="tw-flex tw-w-full tw-flex-col tw-items-center tw-gap-6 tw-bg-gray-900 tw-px-6 tw-pb-12 tw-pt-8 sm:tw-px-2">
              <div className="tw-flex tw-flex-col tw-items-center tw-gap-2 tw-text-center">
                <p className="landing-para tw-m-0 tw-text-lg tw-font-bold">
                  {`${strings.premium} ${strings.tier} 1`}
                </p>
                <p className="landing-para tw-m-0 tw-text-lg tw-text-gray-500">
                  {strings.formatString(
                    strings.premium_tier_billed,
                    <span>{2.5}</span>,
                    <span>{5}</span>
                  )}
                </p>
              </div>
              <Link href={'/premium'} className={'tw-w-[90%] '}>
                <Button
                  size="small"
                  intent="secondary"
                  className="tw-w-full sm:tw-hidden"
                >
                  {strings.formatString(strings.premium_subscribe, 1)}
                </Button>
              </Link>
            </div>
            <div
              className={`tw-flex tw-w-full tw-flex-col tw-items-center tw-gap-6 tw-rounded-tl-2xl tw-rounded-tr-2xl tw-px-6 tw-pt-8 sm:tw-px-2`}
            >
              <div className="tw-flex tw-flex-col tw-items-center tw-gap-2">
                <p className="landing-para tw-m-0 tw-text-center tw-text-lg tw-font-bold">
                  {`${strings.premium} ${strings.tier} 2`}
                </p>
                <p className="landing-para tw-m-0 tw-text-center tw-text-lg tw-text-gray-500">
                  {strings.formatString(
                    strings.premium_tier_billed,
                    <span>{5}</span>,
                    <span>{10}</span>
                  )}
                </p>
              </div>
              <Link href={'/premium'} className={'tw-w-[90%] '}>
                <Button
                  size="small"
                  intent="primary"
                  className="tw-w-full sm:tw-hidden"
                >
                  {strings.formatString(strings.premium_subscribe, 2)}
                </Button>
              </Link>
            </div>
          </div>
          <div>
            {features.features.map((feature: any, index: number) => (
              <div key={index}>
                <div className="landing-para tw-sticky tw-top-24 tw-w-full tw-border-b tw-border-l-0 tw-border-r-0 tw-border-t-0 tw-border-solid tw-border-gray-820 tw-text-sm tw-font-bold tw-text-gray-400">
                  <div className=" tw-flex tw-w-full tw-justify-between">
                    <div className="tw-w-full">{feature.title}</div>
                    <div className="tw-w-full tw-px-6"></div>
                    <div className="tw-w-full tw-px-6 tw-pb-3">
                      <p className="tw-m-0 tw-opacity-0">hellko</p>
                    </div>
                  </div>
                </div>
                {feature.features.map((f, i) => (
                  <div
                    key={i}
                    className={`tw-flex tw-justify-between ${
                      f.title === 'line' ? '' : ''
                    }`}
                  >
                    <div className="tw-flex tw-w-full tw-flex-col tw-justify-center tw-gap-4 tw-pt-4">
                      <div
                        className={`landing-para tw-m-0 tw-flex tw-gap-2 ${
                          f.title === 'line' ? 'tw-hidden' : ''
                        }`}
                      >
                        {f.title}{' '}
                        {/*  {f.info ? (
                          <Tooltip
                            placement="top"
                            overlay={feature.title}
                            trigger={['hover', 'focus']}
                          >
                            <img
                              src="/static/landing/info-circle.svg"
                              alt="info"
                            />
                          </Tooltip>
                        ) : null}*/}
                      </div>
                      <div
                        className={`${
                          f.title === 'line' ? 'tw-hidden' : ''
                        } tw-h-[1px] tw-w-full tw-bg-gray-820`}
                      ></div>
                    </div>
                    <div
                      className={`${
                        f.title === 'line' ? 'tw-opacity-0' : ''
                      } tw-flex tw-w-full tw-flex-col tw-items-center tw-justify-center tw-gap-4 tw-px-6 tw-pt-4`}
                    >
                      {f.tier === 1 ? <Icons.TickCircle /> : <Icons.Line />}
                      <div className=" tw-h-[1px] tw-w-full tw-bg-gray-820"></div>
                    </div>
                    <div
                      className={`tw-flex tw-w-full tw-flex-col tw-items-center tw-justify-center tw-gap-4 tw-px-6 tw-pt-4`}
                    >
                      {' '}
                      <img
                        className={`${
                          f.title === 'line' ? 'tw-opacity-0' : ''
                        }`}
                        src="../static/landing/tick-circle.svg"
                        alt="tick-circle"
                      />
                      {f.tier === 'title' ? <Icons.TickCircle /> : ''}
                      <div
                        className={`${
                          f.title === 'line' ? 'tw-opacity-0' : ''
                        } tw-h-[1px] tw-w-full tw-bg-gray-820`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="premium_tier_2_bg tw-absolute tw-h-full tw-w-[34.42%] tw-rounded-2xl tw-border-[2px] tw-border-solid tw-border-[#434164] ltr:tw-right-0 rtl:tw-left-0"></div>
      </div>
    </div>
  )
}
