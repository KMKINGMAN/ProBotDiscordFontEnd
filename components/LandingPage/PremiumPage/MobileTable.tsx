import Tooltip from 'rc-tooltip'
import { useState, useEffect } from 'react'
import * as Icons from '../Icons'
import strings, { lang } from '@script/locale'

export default function MobileTable(features: any) {
  const [tier, setTier] = useState(true)
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
    <div
      data-aos="zoom-in-up"
      className="mobile-table tw-flex tw-h-fit tw-flex-col tw-justify-between tw-gap-0 lg:tw-justify-center md:tw-flex-wrap"
    >
      <div className="tw-flex tw-flex-col tw-items-center tw-gap-1">
        <h2
          onClick={() => setTier(!tier)}
          className="landing-headline-sec tw-text-center sm:tw-text-2xl"
        >
          {strings.premium_which_plan_title}
        </h2>
      </div>
      <div className="tw-sticky tw-top-16 tw-z-30 tw-w-full tw-bg-gray-900 tw-pt-4">
        <div className="switch-plan-bg tw-flex tw-w-full tw-justify-between tw-rounded-md tw-p-[6px]">
          <div
            onClick={() => setTier(true)}
            className={`${
              tier ? 'tw-bg-gray-800 tw-ring-1 tw-ring-gray-700' : ''
            } landing-para tw-m-0 tw-flex tw-w-full tw-items-center tw-justify-center tw-rounded tw-py-2 tw-text-base tw-transition-all tw-duration-200 `}
          >
            {strings.tier_1}
          </div>
          <div
            onClick={() => setTier(false)}
            className={`${
              tier ? '' : 'tw-bg-[#5753EC] tw-ring-1 tw-ring-[#7672ec]'
            } landing-para tw-flex tw-w-full tw-items-center tw-justify-center tw-rounded tw-py-2 tw-text-base tw-transition-all tw-duration-200`}
          >
            {strings.tier_2}
          </div>
        </div>
      </div>
      <div className="tw-relative tw-mt-12 tw-flex tw-flex-col tw-justify-between tw-gap-11 tw-pb-10 lg:tw-justify-center md:tw-flex-wrap">
        <div className="tw-z-10">
          <div>
            {features.features.map((feature: any, index: number) => (
              <div key={index}>
                <div className="landing-para tw-sticky tw-top-24 tw-w-full tw-border-b tw-border-l-0 tw-border-r-0 tw-border-t-0 tw-border-solid tw-border-gray-820 tw-text-sm tw-font-bold tw-text-gray-400">
                  <div className=" tw-flex tw-w-full tw-justify-between">
                    <div className="tw-w-full">{feature.title}</div>
                    <div className="tw-w-full tw-px-6"></div>
                    <div className="tw-w-full tw-px-6 tw-pb-3">
                      <p className="tw-m-0 tw-opacity-0">hi</p>
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
                    <div className="tw-flex tw-w-[80%] tw-flex-col tw-justify-center tw-gap-4 tw-pt-4">
                      <div
                        className={`landing-para tw-m-0 tw-flex tw-gap-2 tw-text-sm ${
                          f.title === 'line' ? 'tw-hidden' : ''
                        }`}
                      >
                        {f.title}{' '}
                        {f.info ? (
                          <Tooltip
                            placement="top"
                            overlay="hi"
                            trigger={['hover', 'focus']}
                          >
                            <img
                              src="/static/landing/info-circle.svg"
                              alt="info"
                            />
                          </Tooltip>
                        ) : null}
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
                      } tw-flex tw-w-[30%] tw-flex-col tw-items-center tw-justify-center tw-gap-4 tw-px-6 tw-pt-4 ${
                        tier ? '' : 'tw-hidden'
                      }`}
                    >
                      {f.tier === 1 ? <Icons.TickCircle /> : <Icons.Line />}
                      <div className=" tw-h-[1px] tw-w-full tw-bg-gray-820"></div>
                    </div>
                    <div
                      className={`tw-flex tw-w-[30%] tw-flex-col tw-items-center tw-justify-center tw-gap-4 tw-px-6 tw-pt-4 ${
                        tier ? 'tw-hidden' : ''
                      }`}
                    >
                      {' '}
                      <div
                        className={`${
                          f.title === 'line' ? 'tw-opacity-0' : ''
                        }`}
                      >
                        <Icons.TickCircle />
                      </div>
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
      </div>
    </div>
  )
}
