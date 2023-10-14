import Link from 'next/link'
import Image from 'next/image'
import strings from '@script/locale'

export default function OtherFeatures({ features }) {
  return (
    <section className="tw-flex tw-flex-col tw-justify-between tw-gap-8 lg:tw-gap-8 sm:tw-gap-8">
      <div
        data-aos="fade-up"
        data-aos-duration="700"
        className="tw-flex tw-flex-col tw-items-center tw-gap-1"
      >
        <h2 className="landing-headline-sec tw-text-center sm:tw-text-2xl">
          {strings.feautres_learn_more_about_other}
        </h2>
      </div>
      <div
        data-aos="fade-up"
        className="tw-flex tw-justify-between tw-gap-8 lg:tw-gap-4 sm:tw-flex-wrap"
      >
        {features.map((feature: any, index: number) => (
          <Link
            href={`/features/${feature.link}`}
            className={`feature-card-bg tw-flex tw-w-full tw-cursor-pointer tw-flex-col tw-gap-4 tw-rounded-xl tw-border-[2px] tw-border-b-0 tw-border-l-0 tw-border-r-0 tw-border-solid tw-border-gray-800 tw-p-6 tw-transition-all tw-duration-200 hover:-tw-translate-y-4 sm:tw-p-4 hover:tw-border-[${
              feature.color + '10'
            }] hover:tw-bg-gray-820`}
            style={{
              transitionDuration: '200ms',
              textDecoration: 'none',
              color: '#000000'
            }}
          >
            <div className="tw-flex tw-flex-col tw-gap-4">
              <Image
                width={40}
                height={40}
                src={feature.featureIcon}
                alt={feature.tag}
                className="sm:tw-w-[32px]"
              />
              <p className="landing-para tw-m-0 tw-text-base tw-font-semibold tw-text-gray-300">
                {feature.tag}
              </p>
            </div>
            <h4 className="landing-headline-sec tw-text-xl sm:tw-text-[18px]">
              {feature.headline}
            </h4>
          </Link>
        ))}
      </div>
    </section>
  )
}
