import { useContext } from 'react'
import { Button } from './Button'
import { Context } from '@script/_context'
import strings from '@script/locale'
import Link from 'next/link'
import LoadingSpinner from './LoadingSpinner'

export default function Hero() {
  const { auth, user, loading } = useContext(Context)
  const text = {
    tag: strings.landing_new_membership,
    headlind: strings.index_header_big_string,
    desc: strings.why_probot_text,
    btnAdd: strings.add_to_discord,
    btnBrowse: strings.browser_features
  }

  return (
    <section className="tw-flex tw-h-[72vh] tw-items-center tw-justify-center lg:tw-h-[85vh]">
      <div className="tw-flex tw-max-w-[440px] tw-flex-col tw-items-center tw-gap-12">
        <div className="tw-flex tw-flex-col tw-items-center">
          {/* TAG */}
          <div
            data-aos="fade-up"
            className="landing-tag-text border tw-w-fit tw-rounded-full tw-border-solid tw-border-[#5F5DEF33] tw-bg-[#5753EC0A] tw-px-4 tw-py-2 tw-font-semibold lg:tw-text-center"
          >
            {text.tag}
          </div>
          {/* Headline */}
          <div>
            <h1
              data-aos-delay="100"
              data-aos="fade-up"
              className="landing-headline tw-text-center rtl:tw-leading-normal sm:tw-text-3xl"
            >
              {text.headlind}
            </h1>
            <p
              data-aos-delay="200"
              data-aos="fade-up"
              className="landing-para tw-text-center tw-text-gray-300"
            >
              {' '}
              {text.desc}
            </p>
          </div>
        </div>
        {/* Buttons */}
        <div
          data-aos-delay="400"
          data-aos="fade-up"
          className="flex tw-flex-row tw-items-center tw-justify-center tw-gap-4 lg:tw-w-full sm:tw-flex-col sm:tw-gap-2"
        >
          <Button
            className="tw-text-sm lg:tw-w-full"
            intent="primary"
            onClick={() => auth('authback')}
          >
            {text.btnAdd}
          </Button>
          {loading ? (
            <LoadingSpinner />
          ) : user ? (
            <Link className="lg:tw-w-full" href={'/dashboard'}>
              <Button className="tw-text-sm lg:tw-w-full" intent="secondary">
                {strings.dashboard}
              </Button>
            </Link>
          ) : (
            <Link className="lg:tw-w-full" href={'#features'}>
              <Button className="tw-w-full tw-text-sm" intent="secondary">
                {text.btnBrowse}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
