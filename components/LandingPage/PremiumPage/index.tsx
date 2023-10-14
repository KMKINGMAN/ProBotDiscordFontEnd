import { useEffect } from 'react'
import { Navbar, Footer, Stats, PricingTable, FaqPremium } from '../'
import Hero from './Hero'
import AOS from 'aos'
import MobileTable from './MobileTable'
import strings from '@script/locale'
import { Manrope } from '@next/font/google'
import Image from 'next/image'
import { useRouter } from 'next/router'

const manrope = Manrope({
  subsets: ['latin']
})

const sectionStyle = 'tw-max-w-[1080px] tw-m-auto tw-px-3 lg:tw-px-8'

const Premium = () => {
  const { locale } = useRouter()
  const features = [
    {
      title: strings.Logs,
      features: [
        {
          title: strings.voice_move,
          tier: 2
        },
        {
          title: strings.voice_disconnect,
          tier: 2
        },
        {
          title: 'line'
        }
      ]
    },
    {
      title: strings.Variables,
      features: [
        {
          title: strings.welcomer_variable_inviter,
          tier: 1
        },
        {
          title: strings.welcomer_variable_invitername,
          tier: 1
        },
        {
          title: strings.user_invites_counter,
          tier: 1
        },
        {
          title: 'line'
        }
      ]
    },
    {
      title: strings.automod,
      features: [
        {
          title: strings.AUTOMOD_REPEATED,
          tier: 2
        },
        {
          title: 'line'
        }
      ]
    },
    {
      title: strings.AUTO_ROLES,
      features: [
        {
          title: strings.autorole_specific_invite,
          tier: 1
        },
        {
          title: 'line'
        }
      ]
    },
    {
      title: strings.index_card6_title,
      features: [
        {
          title: strings.premium_table_multiple_roles,
          tier: 1
        },
        {
          title: 'line'
        }
      ]
    },
    {
      title: strings.starboard,
      features: [
        {
          title: strings.starboard_custom_emoji,
          tier: 2
        },
        {
          title: 'line'
        }
      ]
    },
    {
      title: strings.premium,
      features: [
        {
          title: strings.premium_table_transfer_bot,
          tier: 2
        },
        {
          title: strings.premium_table_regenerate_link,
          tier: 2
        },
        {
          title: strings.premium_table_custom_bot,
          tier: 2
        },
        {
          title: strings.premium_bot_status,
          tier: 2
        },
        {
          title: strings.premium_table_support,
          tier: 2
        },
        {
          title: 'line'
        }
      ]
    },
    {
      title: strings.premium_table_other_features,
      features: [
        {
          title: strings.Link,
          tier: 1
        },
        {
          title: strings.Voice_Online,
          tier: 1
        },
        {
          title: strings.index_feature_2_title,
          tier: 1
        },
        {
          title: strings.protection,
          tier: 1
        },
        {
          title: 'line'
        }
      ]
    }
  ]
  useEffect(() => {
    AOS.init({ once: true })
    AOS.refresh()
  }, [])
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
        {/* NAVBAR */}
        <Navbar />
        {/* HERO */}
        <div className={`${sectionStyle}`}>
          <Hero />
        </div>
        {/* STATS */}
        <div
          className={`${sectionStyle} tw-mt-40 sm:tw-mt-28 sm:tw-max-w-full sm:tw-px-0`}
        >
          <Stats />
        </div>
        {/* TABLE */}
        <section
          id="comparison"
          className={`${sectionStyle} tw-mt-40 sm:tw-mt-28`}
        >
          <PricingTable features={features} />
          <MobileTable features={features} />
        </section>
        {/* FAQ */}
        <section className={`${sectionStyle} tw-max-w-[800px]`}>
          <FaqPremium />
        </section>
        {/* FOOTER */}
        <div className="landing-footer tw-mt-[320px]">
          <div
            className={`tw-m-auto tw-mt-[120px] tw-max-w-[1240px] tw-px-3 lg:tw-px-8`}
          >
            <Footer />
          </div>
        </div>

        <div className="tw-pointer-events-none tw-absolute tw-top-0 tw-w-[100vw] tw-overflow-clip">
          <Image
            src={'/static/landing/landing-bg-min.png'}
            width={1131}
            height={739}
            alt=""
          />
        </div>
      </div>
    </>
  )
}

export default Premium
