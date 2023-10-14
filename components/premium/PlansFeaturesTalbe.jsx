import style from '@style/userPremium.module.css'
import strings from '../../scripts/locale'
import Image from 'next/image'
import FaqContainer from '@component/faqcontainer'

const LineIcon = () => (
  <svg
    width="17"
    height="2"
    viewBox="0 0 17 2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="1"
      y1="1"
      x2="16"
      y2="1"
      stroke="#8F8F92"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export default function PlansFeaturesTalbe() {
  const FEATURES_DATA = [
    {
      feature: strings.membership_overview_double_daily,
      silver: strings.formatString(
        strings.membership_overview_daily,
        '3',
        '10k'
      ),
      gold: strings.formatString(strings.membership_overview_daily, '5', '25k'),
      diamond: strings.formatString(
        strings.membership_overview_daily,
        '10',
        '50k'
      )
    },
    {
      feature: strings.membership_overview_daily_reps,
      silver: strings.formatString(strings.membership_overview_reps, '5'),
      gold: strings.formatString(strings.membership_overview_reps, '10'),
      diamond: strings.formatString(strings.membership_overview_reps, '30')
    },
    {
      feature: strings.membership_overview_daily_on_discord,
      silver: '-',
      gold: '✓',
      diamond: '✓'
    },
    {
      feature: strings.membership_overview_support,
      silver: `✓`,
      gold: '✓',
      diamond: '✓'
    },
    {
      feature: strings.membership_background_change,
      silver: `✓`,
      gold: '✓',
      diamond: '✓'
    },
    {
      feature: strings.membership_overview_transfer_per_month,
      silver: `-`,
      gold: '✓',
      diamond: '✓'
    }
  ]
  const FAQ = [
    {
      name: strings.membership_faq_question_1,
      content: strings.membership_faq_answer_1
    },
    {
      name: strings.membership_faq_question_2,
      content: strings.membership_faq_answer_2
    },
    {
      name: strings.membership_faq_question_3,
      content: strings.membership_faq_answer_3
    },
    {
      name: strings.membership_faq_question_4,
      content: strings.membership_faq_answer_4
    },
    {
      name: strings.membership_faq_question_5,
      content: strings.membership_faq_answer_5
    }
  ]

  return (
    <footer className={style.footer}>
      <ul className={style.table_header}>
        <li>{strings.tier}</li>
        <li className="flex gap-1 align-items-center">
          <Image
            className={style.tableIcon}
            src="/static/silver.svg"
            width={40}
            height={45}
            alt="silver"
            loading="lazy"
          />
          <span className="sm:tw-hidden">{strings.membership_silver}</span>
        </li>
        <li className="flex gap-1 align-items-center">
          <Image
            className={style.tableIcon}
            src="/static/gold.svg"
            width={40}
            height={45}
            alt="gold"
            loading="lazy"
          />
          <span className="sm:tw-hidden">{strings.membership_gold}</span>
        </li>
        <li className="flex gap-1 align-items-center">
          <Image
            className={style.tableIcon}
            src="/static/diamond.svg"
            width={40}
            height={45}
            alt="diamond"
            loading="lazy"
          />
          <span className="sm:tw-hidden">{strings.membership_diamond}</span>
        </li>
      </ul>
      <ul className={style.table_body}>
        {FEATURES_DATA.map(({ feature, silver, gold, diamond }) => (
          <li key={feature}>
            <span className="tw-text-sm">{feature}</span>
            <span className="tw-text-sm">{silver || <LineIcon />}</span>
            <span className="tw-text-sm">{gold || <LineIcon />}</span>
            <span className="tw-text-sm">{diamond || <LineIcon />}</span>
          </li>
        ))}
      </ul>
      <div className={style.faq__section}>
        <h3>{strings.membership_faq_title}</h3>
        <p className="text-center">
          {strings.formatString(
            strings.membership_faq_description,
            <span>
              <a
                target="_blank"
                href="https://discord.gg/ProBot"
                className="link__server"
              >
                discord.gg/ProBot
              </a>
            </span>
          )}
        </p>
        <div className="faq__main mt-20">
          {FAQ.map(({ name, content }, index) => (
            <FaqContainer key={index} title={name} content={content} />
          ))}
        </div>
      </div>
    </footer>
  )
}
