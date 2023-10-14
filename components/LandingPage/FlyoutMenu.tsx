import { FC, useState, useEffect } from 'react'
import { Button } from './Button'
import Link from 'next/link'
import AOS from 'aos'
import * as Icon from './Icons'
import strings, { lang } from '@script/locale'

const MenuItem = ({ icon, title, desc, href, isNew, id }) => {
  const [hover, setHover] = useState(false)
  return (
    <Link
      href={id ? href : `/${href}`}
      replace
      className="tw-flex tw-cursor-pointer tw-flex-row tw-items-center tw-justify-between tw-gap-5 tw-rounded-lg tw-p-[12px] tw-pr-3 tw-transition-colors tw-duration-200 hover:tw-bg-gray-820 rtl:tw-justify-end"
    >
      <div className="tw-flex tw-flex-row tw-items-center tw-gap-5 rtl:tw-flex-row-reverse">
        <div
          className={`tw-flex tw-rounded tw-p-[6.5px] tw-transition-all tw-duration-150`}
        >
          {icon}
        </div>
        <div className="tw-flex tw-flex-col tw-gap-[4px] rtl:tw-justify-end">
          <div className="tw-flex tw-items-center tw-gap-2 rtl:tw-justify-end ">
            <p className="landing-para tw-m-0 tw-select-none tw-text-gray-200">
              {title}
            </p>
            <span
              className={`landing-para tw-rounded tw-bg-[#807EF3] tw-bg-opacity-10 tw-px-1 tw-text-sm tw-font-extrabold tw-text-[#807EF3] ${
                isNew ? '' : 'tw-hidden'
              }`}
            >
              {strings.new}
            </span>
          </div>
          <p
            className={`landing-para tw-m-0 tw-select-none tw-text-sm tw-transition-all tw-duration-200 ${
              hover ? 'tw-text-gray-200' : 'tw-text-gray-500 '
            }`}
          >
            {desc}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default function FlyoutMenu({ reso }: { reso?: boolean }) {
  const features = [
    {
      title: strings.landing_welcome_messages_tag,
      desc: strings.landing_welcome_messages_title,
      icon: <Icon.Welcome />,
      href: `features/welcome-messages`,
      new: false
    },
    {
      title: strings.embeder,
      desc: strings.landing_embed_messages_title,
      icon: <Icon.Embed />,
      href: 'features/embed-messages',
      new: false
    },
    {
      title: strings.reaction_roles,
      desc: strings.landing_self_assignable_roles_title,
      icon: <Icon.Rr />,
      href: 'features/self-assignable-role',
      new: false
    },
    {
      title: strings.leveling,
      desc: strings.landing_leveling_system_title,
      icon: <Icon.Leveling />,
      href: 'features/leveling-system',
      new: false
    }
  ]

  const resources = [
    {
      title: strings.docs,
      desc: strings.landing_resources_docs_description,
      icon: <Icon.Docs />,
      href: 'https://docs.probot.io/',
      new: false,
      id: '1'
    },
    {
      title: strings.support,
      desc: strings.landing_resources_support_description,
      icon: <Icon.Support />,
      href: 'https://discord.gg/probot',
      new: false,
      id: '1'
    },
    {
      title: strings.commands,
      desc: strings.landing_commands_description,
      icon: <Icon.Commands />,
      href: 'commands',
      new: false
    }
  ]

  useEffect(() => {
    AOS.init()
  }, [])

  const menuData = reso ? resources : features

  return (
    <div className="tw-top-[70px] tw-z-50 tw-grid tw-select-none tw-grid-flow-col tw-grid-rows-3 tw-rounded-lg tw-border tw-border-solid tw-border-gray-800 tw-bg-[#171821] tw-p-2 tw-shadow-gray-950">
      {menuData.map((feature, index) => (
        <MenuItem
          isNew={feature.new}
          icon={feature.icon}
          title={feature.title}
          desc={feature.desc}
          href={feature.href}
          key={index}
          // @ts-ignore
          id={feature.id}
        />
      ))}
    </div>
  )
}
