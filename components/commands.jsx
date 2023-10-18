import { useContext, useState } from 'react'
import strings from '@script/locale'
import Head from 'next/head'
import { ex } from 'probot-locale'
import commands from '@script/commands'
import Image from 'next/image'
import { Context } from '@script/_context'
import { CustomName } from '@component/Command/index'
import { Navbar, Footer } from '../components/LandingPage'
import { Manrope } from 'next/font/google'

const manrope = Manrope({
  subsets: ['latin']
})

const { website } = ex

export default function Commands() {
  const { rtl } = useContext(Context) // context must be used to load language
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const categoryNames = {
    all: 'All',
    general: 'General',
    leveling: 'leveling',
    info: 'info',
    moderation: 'Moderation',
    premium: 'Premium'
  }
  const categoryDescriptions = {
    all: strings.commands_all_description,
    general: strings.commands_general_description,
    leveling: strings.commands_leveling_description,
    info: strings.commands_info_description,
    moderation: strings.commands_moderation_description,
    premium: strings.commands_premium_description
  }

  function Command({ command, category }) {
    const [open, setOpen] = useState(false)

    const toggleOpenRow = () => setOpen(!open)

    return (
      <div
        className={`command-card__container tw-rounded-md tw-bg-[#171821] ${
          filter === 'all' || filter === category ? '' : ' hidden'
        }`}
      >
        <div className="command-card__header tw-p-5" onClick={toggleOpenRow}>
          <div className="tw-flex tw-items-center tw-gap-7">
            <svg
              width="24"
              height="24"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: rtl ? 'scaleX(-1)' : '' }}
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.11111 0C1.39289 0 0 1.39289 0 3.11111V24.8889C0 26.6072 1.39289 28 3.11111 28H24.8889C26.6072 28 28 26.6072 28 24.8889V3.11111C28 1.39289 26.6072 0 24.8889 0H3.11111ZM21.6214 8.42207L19.4216 6.22219L6.22222 19.4216L8.4221 21.6214L21.6214 8.42207Z"
                fill={open ? '#5865F2' : '#333645'}
                style={{ transition: 'fill 0.2s ease-in-out' }}
              />
            </svg>

            <h5 className="command-card__header__title tw-flex tw-flex-col">
              {CustomName[command] || command}{' '}
              <span className="tw-font-normal tw-text-[#8d91a9]">
                {strings[`${command}_description`]}
              </span>
            </h5>
          </div>

          <i
            className={`fa-solid fa-angle-down command-card__header__arrow-icon${
              open ? ' opened-arrow' : ''
            }`}
          ></i>
        </div>
        {open && (
          <div className="command-card__body tw-rounded-lg tw-bg-[#1a1b24] tw-p-7">
            <div className="command-card__body__usage">
              <h5>{strings.usage}</h5>
              <div className="d-flex">
                <p dir="ltr">
                  {website[`usage_${command}`]
                    ? website[`usage_${command}`].replace(
                        /\{0}/gi,
                        `/${command}`
                      )
                    : `/${command}`}
                </p>
              </div>
            </div>
            <div className="command-card__body__examples">
              <h5>{strings.examples}</h5>
              <div className="d-flex">
                <p dir="ltr">
                  {website[`examples_${command}`]
                    ? website[`examples_${command}`].replace(
                        /\{0}/gi,
                        `/${command}`
                      )
                    : `/${command}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const sectionStyle = 'tw-max-w-[1240px] tw-m-auto tw-px-3 lg:tw-px-8'

  return (
    <div className="outside-panel tw-bg-gray-900">
      <Head>
        <meta charSet="utf-8" />
        <title>
          {strings.discord_bot_commands} - {strings.probot}
        </title>
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://probot.io/commands"
        />
      </Head>
      <Navbar />
      <div className={`${sectionStyle} tw-mt-[7rem] tw-h-full`}>
        <div className="mb-30">
          <div>
            <h2 className="mb-10 tw-text-3xl">
              {strings.discord_bot_commands}
            </h2>
            <p className="landing-para tw-text-sm tw-font-normal tw-text-gray-200">
              {strings.commands_title_description}
            </p>
          </div>
        </div>
        <div className="command__input tw-mt-10 tw-flex tw-flex-wrap tw-items-center tw-gap-10">
          <ul
            role="tablist"
            className="commands-pills tw-flex-2 mb-20 tw-flex tw-w-max tw-pt-2 sm:tw-w-full sm:tw-overflow-x-auto"
            id="myTabs_6"
          >
            <li
              className={`${
                filter === 'all' ? 'active ' : ''
              }btn btn-commands-category`}
              onClick={() => setFilter('all')}
            >
              {strings.all}
            </li>
            {Object.keys(commands).map((category, index) => (
              <li
                key={index}
                className={`${
                  filter === category ? 'active ' : ''
                }btn btn-commands-category`}
                onClick={() => setFilter(category)}
              >
                {strings[categoryNames[category]]}
              </li>
            ))}
          </ul>
          <input
            type="text"
            className="search__bar tw-mb-4 tw-flex-1 tw-rounded-md tw-bg-[#171821] tw-p-4"
            placeholder={strings.search_for_command}
            onChange={(event) => {
              setSearch(event.target.value)
              if (filter !== 'all') setFilter('all')
            }}
          />
        </div>
        <p className="tw-mt-3 tw-font-bold tw-text-[#8d91a9]">
          {categoryDescriptions[filter]}
        </p>
        <div className="commands-list">
          {Object.keys(commands).map((category) =>
            commands[category]
              .filter((command) =>
                search
                  ? String(`/${command} ${strings[`${command}_description`]}`)
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  : true
              )
              .map((command, index) => (
                <Command key={index} command={command} category={category} />
              ))
          )}
        </div>
      </div>
      <div className="landing-footer ">
        <div className={`${sectionStyle}`}>
          <Footer />
        </div>
      </div>
      <div className="tw-pointer-events-none tw-absolute tw-top-0 tw-overflow-hidden sm:tw-hidden">
        <Image
          src={'/static/landing/landing-bg-min.png'}
          width={1131}
          height={739}
          decoding="async"
        />
      </div>
    </div>
  )
}
