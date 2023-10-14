import { Button } from "../Button"
import Image from 'next/image'
import { useContext } from 'react'
import Link from 'next/link'
import { Context } from '@script/_context'

type FeatureHeroData = {
  tag: string
  headline: string
  desc: string
  img: string
  featureIcon: string
  btnGetStarted: string
  color: string
}

export default function FeatureHero({ data }: { data: FeatureHeroData }) {
  const { auth, logged } = useContext(Context)

  return (
    <section className="tw-py-auto tw-flex tw-h-[70vh] tw-items-center tw-justify-between lg:tw-h-[85vh] lg:tw-items-center lg:tw-justify-center">
      <div className="tw-flex tw-max-w-[437px] tw-flex-col tw-gap-6 lg:tw-items-center">
        <div className="tw-flex tw-flex-col lg:tw-items-center">
          {/* TAG */}
          <p
            data-aos-delay="100"
            data-aos="fade-up"
            className={`features-tag-text tw-m-0`}
            style={{ color: data.color }}
          >
            {data.tag}
          </p>
          {/* Headline */}
          <div>
            <h1
              data-aos-delay="200"
              data-aos="fade-up"
              className="landing-headline-sec lg:tw-text-center"
            >
              {data.headline}
            </h1>
            <p
              data-aos-delay="300"
              data-aos="fade-up"
              className="landing-para tw-text-gray-300 lg:tw-text-center"
            >
              {' '}
              {data.desc}
            </p>
          </div>
        </div>
        {/* Buttons */}
        <div
          data-aos-delay="400"
          data-aos="fade-up"
          className="flex tw-flex-row tw-gap-4 lg:tw-items-center sm:tw-w-full sm:tw-flex-col sm:tw-gap-2"
        >
          {logged ? (
            <Link href="/dashboard">
              <Button
                intent="secondary"
                style={{ backgroundColor: data.color }}
              >
                {data.btnGetStarted}
              </Button>
            </Link>
          ) : (
            <Button onClick={() => auth('auth')} intent="secondary">
              {data.btnGetStarted}
            </Button>
          )}
        </div>
      </div>

      <div data-aos-delay="100" data-aos="fade-up" className="lg:tw-hidden">
        <Image
          src={data.img}
          alt={data.tag}
          width={512}
          height={335}
          className="tw-max-w-[550px] 2xl:tw-max-w-lg"
        />
      </div>
    </section>
  )
}
