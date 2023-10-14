import { Button } from '../Button'
import Link from 'next/link'
import strings, { lang } from '@script/locale'

export default function Plans({ yearly, monthly }) {
  const PlanInfo = [
    {
      tier: 1,
      title: strings.formatString(strings.premium_tier_get, 1),
      price: monthly ? '5$' : '30$',
      descreption: strings.prime_description_2,
      features: [
        strings.prime_features_1,
        strings.prime_features_2,
        strings.prime_features_3,
        strings.prime_features_4
      ]
    },
    {
      tier: 2,
      title: strings.formatString(strings.premium_tier_get, 2),
      price: monthly ? '10$' : '60$',
      descreption: strings.premium_description_1,
      features: [
        strings.prime_features_1,
        strings.prime_features_2,
        strings.premium_table_custom_bot,
        strings.premium_table_transfer_bot
      ],
      isSpecial: true
    }
  ]

  return (
    <div
      data-aos-delay="300"
      data-aos="fade-up"
      className="tw-flex tw-justify-center tw-gap-10 md:tw-flex-wrap sm:tw-gap-6"
    >
      {PlanInfo.map((plan, index) => (
        <Link
          href="/premium"
          key={index}
          className={`${
            plan.tier === 2
              ? 'premium_tier_2_bg tw-border-[#434164]'
              : 'tw-border-gray-800'
          } tw-relative tw-flex tw-flex-col tw-gap-6 tw-rounded tw-border-[1px] tw-border-solid tw-bg-gray-850 tw-p-8 tw-transition-all tw-duration-300 hover:-tw-translate-y-3 sm:tw-w-full`}
        >
          <div
            className={` ${
              plan.tier === 2 ? '' : 'tw-hidden'
            } landing-para tw-absolute -tw-right-4 -tw-top-4 tw-z-30 tw-rounded-full tw-border-[4px] tw-border-solid tw-border-[#1E1D2F] tw-bg-[#7E67FF] tw-px-4 tw-py-1`}
          >
            {strings.premium_most_popular_tag}
          </div>
          <div className="tw-flex tw-flex-col tw-gap-6 tw-border-b-[0px] tw-border-l-0 tw-border-r-0 tw-border-t-0 tw-border-solid tw-border-gray-800 sm:tw-gap-4 sm:tw-pb-4">
            <div className="tw-flex tw-flex-col tw-gap-2">
              <p className="landing-para tw-text-2xl sm:tw-text-xl">
                {plan.title}
              </p>
              <p className="landing-para tw-max-w-xs tw-text-gray-400">
                {plan.descreption}
              </p>
            </div>
            <div className="tw-flex tw-items-end tw-gap-2">
              <p className="landing-para tw-text-4xl">{plan.price}</p>
              <p className="landing-para tw-text-gray-400">
                {monthly ? `/${strings.monthly}` : `/${strings.yearly}`}
              </p>
            </div>
          </div>
          <div className="tw-flex tw-flex-col tw-gap-3">
            {plan.features.map((feature, i) => (
              <div className="tw-flex tw-items-center tw-gap-2" key={i}>
                <img
                  src={`/static/landing/${
                    plan.tier === 2 ? 'tick-premium.svg' : 'tick.svg'
                  }`}
                  alt=""
                />
                <p className="landing-para tw-text-gray-400">{feature}</p>{' '}
              </div>
            ))}
          </div>
          <Button
            intent={plan.tier === 2 ? 'primary' : 'secondary'}
            className="tw-mt-16 sm:tw-mt-0"
            size="medium"
          >
            {plan.title}
          </Button>
        </Link>
      ))}
    </div>
  )
}
