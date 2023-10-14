/* eslint-disable indent */
import strings from '@script/locale'
import {
  Navbar,
  Hero,
  Stats,
  Features,
  Footer
} from '../components/LandingPage'
import { Manrope } from 'next/font/google'
import Image from 'next/image'
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useRouter } from 'next/router'

const manrope = Manrope({
  subsets: ['latin']
})

function Home() {
  const { locale } = useRouter()
  useEffect(() => {
    AOS.init({ once: true })
    AOS.refresh()
  }, [])

  const sectionStyle = 'tw-max-w-[1240px] tw-m-auto tw-px-3 lg:tw-px-8'

  return (
    <>
      <style global jsx>{`
        body,
        html,
        #__next,
        .wrapper {
          height: auto;
          background: #12131a;
        }
      `}</style>
      <div
        className={`${
          ['ar', 'fa'].includes(locale) ? '' : manrope.className
        } landing-page landing-text tw-h-fit tw-bg-gray-900`}
      >
        <Navbar />

        <div className={`${sectionStyle}`}>
          <Hero />
        </div>

        <div className={`${sectionStyle} sm:tw-max-w-full sm:tw-px-0`}>
          <Stats />
        </div>

        <div className={`${sectionStyle}`}>
          <Features />
        </div>

        <div className="landing-footer ">
          <div className={`${sectionStyle}`}>
            <Footer />
          </div>
        </div>

        <div className="tw-pointer-events-none tw-absolute tw-top-0 tw-w-[100vw] tw-overflow-clip">
          <Image
            src={'/static/landing/landing-bg-min.png'}
            width={1131}
            height={739}
            alt={'bg-min'}
            priority={true}
          />
        </div>
      </div>
    </>
  )
}

export default Home
