import Plans from './Plans'
import { Button } from '../Button'
import strings from '@script/locale'

const sectionStyle = 'tw-max-w-[1080px] tw-m-auto tw-px-3 lg:tw-px-8'

export default function Hero() {
  return (
    <section className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-14 tw-pt-32 sm:tw-pt-16">
      <div className="tw-flex tw-max-w-[540px] tw-flex-col tw-items-center tw-gap-12">
        <div className="tw-flex tw-flex-col tw-items-center">
          {/* Headline */}
          <div>
            <h1
              data-aos-delay="100"
              data-aos="fade-up"
              className="landing-headline tw-text-center tw-text-4xl sm:tw-text-3xl"
            >
              {strings.premium_index_1.replace(
                /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
                ''
              )}
            </h1>
            <p
              data-aos-delay="200"
              data-aos="fade-up"
              className="landing-para tw-text-center tw-text-[16px] tw-text-gray-300"
            >
              {' '}
              {strings.premium_index_2}
            </p>
          </div>
        </div>
      </div>
      <Plans monthly={true} yearly={false} />
    </section>
  )
}

{
  /* <Plans monthly={true} yearly={false} /> */
}
