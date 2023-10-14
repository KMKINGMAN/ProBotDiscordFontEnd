import { useState } from 'react'
import strings from '@script/locale'

function FAQitem({ q, a }) {
  const [isOpen, setIsOpen] = useState(false)

  const FAQ = [
  {
    q: strings.premium_faq_question_1,
    a: strings.premium_faq_answer_1
  },
  {
    q: strings.premium_faq_question_2,
    a: strings.premium_faq_answer_2
  },
  {
    q: strings.premium_faq_question_3,
    a: strings.premium_faq_answer_3
  },
  {
    q: strings.premium_faq_question_4,
    a: strings.premium_faq_answer_4
  },
  {
    q: strings.premium_faq_question_5,
    a: strings.premium_faq_answer_5
  },
  {
    q: strings.premium_faq_question_6,
    a: strings.premium_faq_answer_6
  }
]

  return (
    <div
      className={`tw-flex tw-cursor-pointer tw-flex-col tw-rounded tw-border-[1px] tw-border-solid tw-border-gray-820 tw-bg-gray-850 tw-p-5 tw-transition-all hover:tw-border-gray-800 ${
        isOpen ? 'tw-border-gray-400 tw-bg-gray-800' : ''
      }`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <p className="landing-para tw-select-none tw-text-lg">{q}</p>
      <div
        className={`tw-grid tw-transition-all tw-duration-300 ${
          isOpen ? 'tw-grid-rows-[1fr]' : 'tw-grid-rows-[0fr]'
        }`}
      >
        <div className="tw-overflow-hidden">
          <p className="landing-para tw-mt-4 tw-text-gray-300">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FaqPremium() {
  const FAQ = [
  {
    q: strings.premium_faq_question_1,
    a: strings.premium_faq_answer_1
  },
  {
    q: strings.premium_faq_question_2,
    a: strings.premium_faq_answer_2
  },
  {
    q: strings.premium_faq_question_3,
    a: strings.premium_faq_answer_3
  },
  {
    q: strings.premium_faq_question_4,
    a: strings.premium_faq_answer_4
  },
  {
    q: strings.premium_faq_question_5,
    a: strings.premium_faq_answer_5
  },
  {
    q: strings.premium_faq_question_6,
    a: strings.premium_faq_answer_6
  }
]
  return (
    <div className="tw-flex tw-flex-col tw-gap-10">
      <div
        data-aos="zoom-in-up"
        data-aos-duration="500"
        data-aos-offset="200"
        className="tw-flex tw-flex-col tw-items-center tw-gap-1"
      >
        <h2 className="landing-headline-sec tw-text-center sm:tw-text-2xl">
          {strings.membership_faq_title}
        </h2>
        <p className="landing-para tw-text-center tw-text-gray-400">
          {strings.formatString(
            strings.membership_faq_description,
            <span className="tw-underline tw-transition-all hover:tw-opacity-80">
              <a href="https://discord.gg/probot">discord.gg/ProBot</a>
            </span>
          )}
        </p>
      </div>
      <div
        data-aos="zoom-in"
        data-aos-duration="500"
        data-aos-offset="0"
        className="tw-flex tw-flex-col tw-gap-2"
      >
        {FAQ.map((item, index) => (
          <FAQitem q={item.q} a={item.a} key={index} />
        ))}
      </div>
    </div>
  )
}
