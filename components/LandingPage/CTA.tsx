import { Button } from './Button'
import { motion } from 'framer-motion'
import { wrap } from 'popmotion'
import { useState, useContext } from 'react'
import { Context } from '@script/_context'
import Image from 'next/image'
import * as Icon from './Icons'
import strings, { lang } from '@script/locale'

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }
  },
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    }
  }
}

const servers = [
  {
    name: 'd7oomy999',
    isVerified: true,
    membersCount: '164,156',
    descreption:
      'البوتات كثيرة ولكن بروبوت الأفضل من ناحية سهولة الأستخدام والسرعة والخدمة. اذا كانت الصياغة مو مناسبتكم عادي يمديكم تصيغوها بالطريقة الي انتم حابينها',
    icon: 'https://cdn.discordapp.com/icons/759413478833782784/a_32eda676fb03c8af650679c60c14bcf9.webp?size=128'
  },
  {
    name: 'oCMz',
    isVerified: true,
    membersCount: '171,881',
    descreption:
      'بوت مميز ومتكامل ومصدر فخر لكونه بوت عربي ساعدنا في تنظيم وتطوير السيرفر والمحافظه على الامان فيه',
    icon: 'https://cdn.discordapp.com/icons/547436115741900801/a3b0bfa23c77afa6769b7bb4ea3dd6fc.webp?size=128'
  }
]

export default function CTA({}) {
  const { auth, rtl } = useContext(Context)

  const [[page, direction], setPage] = useState([0, 0])
  const serverIndex = wrap(0, servers.length, page)
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  return (
    <section className="premium_hero_bg tw-absolute tw-top-[-28%] tw-w-full tw-overflow-visible tw-rounded-lg tw-px-8 tw-py-16 lg:tw-top-[-10%] lg:tw-py-12 sm:tw-top-[-8%] sm:tw-px-8 sm:tw-py-8">
      <div className="tw-flex tw-w-full tw-items-center tw-justify-between lg:tw-flex-col lg:tw-items-start lg:tw-gap-8">
        <div className="tw-ml-8 tw-flex tw-w-fit tw-flex-col tw-gap-10 lg:tw-ml-0 lg:tw-gap-8 sm:tw-gap-4">
          <div className="tw-flex tw-flex-col tw-gap-6 sm:tw-gap-2">
            <h2 className="landing-headline-sec tw-m-0 tw-w-[435px] tw-text-4xl lg:tw-w-fit sm:tw-text-2xl">
              {strings.landing_testimonial_title}
            </h2>
            <p className="landing-para tw-m-0 tw-w-fit tw-text-xl tw-text-[#C2C1FB]">
              {strings.formatString(
                strings.landing_join_over,
                <span className="tw-font-bold tw-tracking-tight tw-text-white">
                  9.000.000
                </span>
              )}
            </p>
          </div>
          <Button
            onClick={() => auth('authback')}
            className="tw-w-fit tw-border-none tw-bg-[#ffffff14] sm:tw-w-full"
          >
            {strings.add_to_discord}
          </Button>
        </div>
        <div
          className={`tw-absolute tw-bottom-[0px] ${
            rtl ? 'tw-left-[-200px]' : 'tw-right-[-200px]'
          } tw-animate-fadeIn tw-overflow-visible lg:tw-hidden`}
        >
          <Icon.Mascot />
        </div>
        {/* <div className="tw-h-[300px] tw-w-[509px] tw-overflow-hidden tw-rounded-md tw-border-[1px] tw-border-solid tw-border-[#9683FA] tw-bg-[#664eee] tw-p-8 lg:tw-w-full sm:tw-h-[350px] sm:tw-p-4">
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 }
            }}
            style={{ float: 'left' }}
            className="tw-h-full tw-w-full"
          >
            <div className="tw-flex tw-h-full tw-scroll-m-5 tw-flex-col tw-justify-between tw-gap-8">
              <div className="tw-flex tw-flex-col tw-gap-5">
                <Image
                  width={23}
                  height={20}
                  src="/static/landing/Frame.svg"
                  className="tw-w-fit"
                  alt="frame"
                />
                <p className="landing-para tw-m-0 tw-text-base">
                  {servers[serverIndex].descreption}
                </p>
              </div>
              <div className="tw-flex tw-items-center tw-gap-4">
                <Image
                  src={servers[serverIndex].icon}
                  alt="server icon"
                  width={52}
                  height={52}
                  className="tw-rounded-md sm:tw-h-[44px] sm:tw-w-[44px]"
                />
                <div className="tw-flex tw-flex-col">
                  <div className="tw-flex tw-flex-row tw-items-center tw-gap-1">
                    <p className="landing-para tw-m-0">
                      {servers[serverIndex].name}
                    </p>
                    <Icon.Verified />
                  </div>
                  <p className="landing-para tw-m-0 tw-text-base">
                    {servers[serverIndex].membersCount}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          <div
            className={`transfer_arrow tw-absolute ${
              rtl ? 'rtl_arrow' : 'tw-right-[-16px]'
            }  tw-cursor-pointer tw-rounded-full tw-bg-[#8685FF] tw-p-[13px] tw-transition-colors hover:tw-bg-[#8d8df0]`}
            onClick={() => paginate(1)}
          >
            <Image
              width={24}
              height={24}
              className={`tw-block`}
              src="/static/landing/arrow.svg"
              alt="arrow"
            />
          </div>
        </div> */}
      </div>
    </section>
  )
}
