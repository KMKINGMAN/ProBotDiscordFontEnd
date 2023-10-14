import { useEffect } from 'react'
import { Button } from './Button'
import Link from 'next/link'
import Image from 'next/image'

type featureData = {
  reversed: boolean
  tag?: string
  title: string
  desc: string
  btn: string
  img: string
  link: string
  icon: string
}

export default function Feature({ feature }: { feature: featureData }) {
  return (
    <div
      data-aos="fade-up"
      data-aos-offset="150"
      data-aos-duration="600"
      className={`tw-flex ${
        feature.reversed ? 'tw-flex-row-reverse' : ''
      } tw-items-center lg:tw-flex-col-reverse lg:tw-gap-12 ${
        feature.tag ? 'tw-justify-between' : 'tw-gap-16'
      }`}
    >
      <div className="tw-flex tw-max-w-[435px] tw-flex-col tw-gap-8 lg:tw-items-center">
        {/* Header */}
        <div className="tw-flex tw-flex-col tw-gap-6 lg:tw-items-center">
          {feature.tag ? (
            <div className="tw-bg-[#5753EC0A tw-py-2tw-rounded-full tw-flex tw-w-fit tw-items-center tw-gap-4 tw-font-semibold lg:tw-text-center">
              <div className="features-tag-icon tw-p-2">
                <Image
                  src={feature.icon}
                  alt={feature.tag}
                  width={25}
                  height={24}
                  className="tw-block"
                />
              </div>
              <p className="features-tag-text tw-m-0">{feature.tag}</p>
            </div>
          ) : null}
          <div className="tw-flex tw-flex-col tw-gap-5 lg:tw-items-center lg:tw-text-center">
            <h2 className="landing-headline-sec tw-m-0 tw-max-w-[400px] sm:tw-text-2xl">
              {feature.title}
            </h2>
            <p className="landing-para tw-text-gray-400 sm:tw-text-sm">
              {feature.desc}
            </p>
          </div>
        </div>
        {/* CTA */}
        <div>
          <Link href={feature.link}>
            <Button intent="secondary" className="sm:tw-text-sm">
              {feature.btn}
            </Button>
          </Link>
        </div>
      </div>
        <Image
          src={feature.img}
          alt={feature.tag}
          width={563}
          height={326}
          className={'sm:tw-w-full sm:tw-h-full'}
        />
    </div>
  )
}
