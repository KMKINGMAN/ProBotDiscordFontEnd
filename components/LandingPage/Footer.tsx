import Image from 'next/image'
import strings, { lang } from '@script/locale'
import CTA from './CTA'
import Link from 'next/link'
import { Context } from '@script/_context'
import Dropdown from 'rc-dropdown'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export default function Footer() {
  const footerLinks = [
    {
      title: strings.landing_footer_website_pages,
      links: [
        { display: strings.membership, url: '/memberships', new: true },
        { display: strings.dashboard, url: '/dashboard' },
        { display: strings.docs, url: 'https://docs.probot.io' },
        { display: strings.premium, url: '/pricing' },
        { display: strings.commands, url: '/commands' }
      ]
    },
    {
      title: strings.landing_footer_other_links,
      links: [
        { display: 'Twitter', url: 'https://twitter.com/TryProBot' },
        { display: 'Discord', url: 'https://discord.gg/ProBot' },
        { display: 'Top.gg', url: 'https://top.gg/bot/probot' }
      ]
    },
    {
      title: strings.landing_footer_rules,
      links: [
        { display: strings.tos_title, url: '/terms-of-use' },
        { display: strings.pp_title, url: '/privacy-policy' },
        { display: strings.rp_title, url: '/refund-policy' }
      ]
    }
  ]

  const socials = [
    {
      platform: 'discord',
      url: 'https://discord.gg/probot'
    },
    {
      platform: 'reddit',
      url: 'https://www.reddit.com/r/probot'
    },
    {
      platform: 'twitter',
      url: 'https://twitter.com/TryProBot'
    }
  ]
  const router = useRouter()
  const [dropdown, setDropdown] = useState(false)

  const { language, rtl } = useContext(Context)

  const LanguagesMenu = () => (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        side={'bottom'}
        align={`start`}
        className={`${
          rtl ? '' : ''
        } tw-w-min-[220px] overflow-auto tw-flex tw-h-[50vh] tw-flex-col tw-items-center tw-rounded-lg tw-border tw-border-solid tw-border-[#1E202C] tw-bg-[#171821] tw-px-0 tw-py-2 data-[side=bottom]:tw-animate-slideUpAndFade data-[side=left]:tw-animate-slideRightAndFade data-[side=right]:tw-animate-slideLeftAndFade data-[side=top]:tw-animate-slideDownAndFade`}
      >
        {Object.keys(lang)
          .sort()
          .filter((index) => language !== index)
          .map((index) => (
            <DropdownMenu.Item
              key={index}
              className="tw-relative tw-w-full tw-select-none tw-outline-none"
              onClick={() => setDropdown(!dropdown)}
            >
              <Link
                href={`/${router.pathname}`}
                className={
                  ' tw-flex tw-w-full tw-cursor-pointer tw-flex-row-reverse tw-justify-between tw-rounded-none tw-px-5 tw-py-[10px] tw-text-gray-300 tw-transition-colors tw-duration-150 hover:tw-bg-gray-800/40 hover:tw-text-gray-100'
                }
                locale={index}
              >
                <Image
                  src={`/static/flags/${lang[index].flag}.png`}
                  alt={`${language} flag`}
                  className="tw-rounded"
                  draggable={false}
                  width={38}
                  height={20}
                  loading={'lazy'}
                />
                {lang[index].name}
              </Link>
            </DropdownMenu.Item>
          ))}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  )
  return (
    <div className="tw-relative tw-mt-[420px] tw-flex tw-h-full tw-flex-col tw-justify-between tw-gap-12 tw-pt-16 lg:tw-mt-[512px] sm:tw-mt-[280px]">
      <CTA />
      <div className="tw-mt-48 tw-flex tw-flex-row tw-justify-between lg:tw-mt-56 lg:tw-flex-col lg:tw-gap-7">
        <div className="tw-flex tw-max-w-sm tw-flex-col tw-gap-6">
          <Image
            src="/static/landing/logo.svg"
            width={139.27}
            height={36.43}
            alt="probot"
          />
          <p className="landing-para tw-text-sm tw-text-gray-400">
            {strings.why_probot_text}
          </p>
          <DropdownMenu.Root modal={false} defaultOpen={true} open={dropdown}>
            <DropdownMenu.Trigger
              onClick={() => setDropdown(!dropdown)}
              asChild
            >
              <div className="tw-flex tw-h-fit tw-w-fit tw-cursor-pointer tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-gray-820 tw-p-[8px] tw-transition-colors tw-duration-100 hover:tw-bg-gray-800">
                <Image
                  className="tw-rounded"
                  alt={`${language} flag`}
                  width={38}
                  height={20}
                  src={`/static/flags/${lang[language]?.flag}.png`}
                  draggable={false}
                />
                <p className="landing-para tw-text-sm tw-text-gray-300">
                  {lang[language].name}
                </p>
                <Image
                  width={13}
                  height={20}
                  className="tw-mr-1 tw-opacity-60"
                  src="/static/landing/arrow-down.svg"
                  alt={language}
                />
              </div>
            </DropdownMenu.Trigger>
            <LanguagesMenu />
          </DropdownMenu.Root>
        </div>
        <div className="tw-flex tw-flex-row tw-gap-20 lg:tw-flex-col lg:tw-gap-8">
          {footerLinks.map((footerLink, index) => (
            <div key={index} className="tw-flex tw-flex-col tw-gap-6">
              <div className="landing-para">{footerLink.title}</div>
              <div className="tw-flex tw-flex-col tw-gap-4">
                {footerLink.links.map((link, linksIndex) => (
                  <Link
                    key={linksIndex}
                    className="landing-para tw-flex tw-w-fit tw-items-center tw-gap-2 tw-text-sm tw-text-gray-400 tw-transition-all tw-duration-150 hover:tw-text-gray-200"
                    href={link.url}
                  >
                    {link.display}

                    {link.new && (
                      <p className="tw-m-0 tw-rounded tw-bg-[#ef67670f] tw-px-2 tw-py-[2px] tw-text-[12px] tw-font-extrabold tw-uppercase tw-text-[#EF6767]">
                        {strings.new}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="tw-mt-14 tw-flex tw-flex-row tw-justify-between tw-border-b-0 tw-border-l-0 tw-border-r-0 tw-border-t-2 tw-border-solid tw-border-t-gray-850 tw-py-8 sm:tw-flex-col sm:tw-items-center sm:tw-gap-5">
        <p className="landing-para tw-m-0 tw-text-sm tw-text-gray-400">
          {strings.formatString(strings.rights, new Date().getFullYear())}
        </p>
        <div className="tw-flex tw-flex-row tw-items-center tw-gap-4">
          {socials.map((social, index) => (
            <Link
              key={index}
              href={social.url}
              className="tw-rounded-sm tw-transition-all tw-duration-200 hover:tw-bg-gray-850"
            >
              <Image
                src={`/static/landing/${social.platform}.svg`}
                className="tw-block"
                width={28}
                height={20}
                alt={social.platform}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
