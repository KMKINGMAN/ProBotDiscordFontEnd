import {
  FeatureHero,
  FeatureTags,
  OtherFeatures,
  Navbar,
  Footer
} from '../index'
import Features from './Features'
import { Manrope } from '@next/font/google'
import { useRouter } from 'next/router'
import Image from 'next/image'

const manrope = Manrope({
  subsets: ['latin']
})

const sectionStyle = 'tw-max-w-[1240px] tw-m-auto tw-px-3 lg:tw-px-8'

export default function FeaturePage(content: any) {
  const { locale } = useRouter()
  const color = content.content.featureTagData.color
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
          locale === 'ar' ? '' : manrope.className
        } landing-text tw-h-fit tw-w-full tw-bg-gray-900`}
      >
        <Navbar />
        {/* HERO */}
        <div
          style={
            {
              // backgroundImage: `linear-gradient(0deg, ${color}46 -334.79%, ${color}00 50%)`
              // borderBottom: `3px solid ${color}50`
            }
          }
        >
          <div className={`${sectionStyle}`}>
            <FeatureHero data={content.content.heroSectionData} />
          </div>
        </div>
        {/* TAGS */}
        <div className={`${sectionStyle} tw-mt-10 lg:tw-mt-0`}>
          <FeatureTags data={content.content.featureTagData} />
        </div>
        {/* FEATURES */}
        <div className={`${sectionStyle} tw-mt-48 lg:tw-mt-20`}>
          <div className="tw-flex tw-flex-col tw-gap-8">
            <Features features={content.content.features} />
          </div>
        </div>
        {/* OTHER */}
        <div className={`${sectionStyle} tw-mt-48 lg:tw-mt-20`}>
          <OtherFeatures features={content.content.otherFeatures} />
        </div>
        {/* FOOTER */}
        <div className="landing-footer ">
          <div className={`${sectionStyle}`}>
            <Footer />
          </div>
        </div>

        <div className="tw-pointer-events-none tw-absolute tw-top-0 tw-w-[100vw] tw-overflow-clip">
          <svg
            width="948"
            height="633"
            viewBox="0 0 948 633"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_f_2175_49846)">
              <ellipse
                cx="473.835"
                cy="105.217"
                rx="376"
                ry="43.4555"
                transform="rotate(50.9049 473.835 105.217)"
                fill="url(#paint0_linear_2175_49846)"
                fillOpacity="0.16"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_2175_49846"
                x="0.308594"
                y="-421.9"
                width="947.053"
                height="1054.23"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="117"
                  result="effect1_foregroundBlur_2175_49846"
                />
              </filter>
              <linearGradient
                id="paint0_linear_2175_49846"
                x1="473.835"
                y1="61.7615"
                x2="484.44"
                y2="176.264"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor={color} />
                <stop offset="1" stopColor={color} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </>
  )
}
