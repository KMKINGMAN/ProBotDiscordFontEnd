import { useState, useContext, useEffect } from 'react'
import strings, { lang } from '@script/locale'
import { Context } from '@script/_context'
import FlyoutMenu from './FlyoutMenu'
import Dropdown from 'rc-dropdown'
import Link from 'next/link'
import { Button } from './Button'
import Image from 'next/image'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Icon from './Icons'
import { useRouter } from 'next/router'
import LoadingSpinner from './LoadingSpinner'

export default function Navbar() {
  // HIDE ON SCROLL FUNC
  const [show, setShow] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const navbarState = () => {
    if (window) {
      if (window.scrollY > lastScrollY) {
        setShow(false)
      } else {
        setShow(true)
      }
      setLastScrollY(window.scrollY)
    }
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', navbarState)
      return () => {
        window.removeEventListener('scroll', navbarState)
      }
    }
  }, [lastScrollY])

  // useState / Context
  const router = useRouter()
  const [dropdown, setDropdown] = useState(false)
  const { user, logout, auth, language, rtl, loading } = useContext(Context)

  // Components
  const DropdownItem = (props: any) => (
    <DropdownMenu.Item className="tw-relative tw-select-none tw-outline-none">
      <Link
        href={`${props.outside ? '' : '/'}${props.href ?? ''}`}
        replace
        onClick={(e) => {
          if (props.logout) {
            e.preventDefault()
            logout()
          }
        }}
        className={`tw-flex tw-w-full tw-cursor-pointer tw-justify-between tw-rounded-none tw-px-5 tw-py-[10px] tw-text-gray-300 tw-transition-colors tw-duration-150 hover:tw-bg-gray-800/40 hover:tw-text-gray-100 ${
          props.logout
            ? 'tw-text-red-main hover:tw-bg-red-main/10 hover:tw-text-red-main'
            : ''
        } ${
          props.membership
            ? 'tw-text-[#f4c238] tw-transition-all tw-duration-200 hover:tw-bg-[#f4c238]/10 hover:tw-text-[#f4c238]'
            : ''
        } `}
      >
        {props.children}
      </Link>
    </DropdownMenu.Item>
  )
  const LanguagesMenu = () => (
    <DropdownMenu.SubContent
      sideOffset={2}
      alignOffset={-5}
      className={`${
        rtl ? 'dropdown__content_rtl' : 'dropdown__content'
      } tw-w-min-[220px] overflow-auto tw-left-[45%] tw-right-12 tw-top-10 tw-flex tw-h-[50vh] tw-flex-col tw-items-center tw-rounded-lg tw-border tw-border-solid tw-border-[#1E202C] tw-bg-[#171821] tw-px-0 tw-py-2 data-[side=bottom]:tw-animate-slideUpAndFade data-[side=left]:tw-animate-slideRightAndFade data-[side=right]:tw-animate-slideLeftAndFade data-[side=top]:tw-animate-slideDownAndFade rtl:tw-left-0`}
    >
      {Object.keys(lang)
        .sort()
        .filter((index) => language !== index)
        .map((index) => (
          <DropdownMenu.Item
            onClick={() => setDropdown(!dropdown)}
            className="tw-relative tw-w-full tw-select-none tw-outline-none"
          >
            <Link
              href={router.pathname}
              className={
                ' tw-flex tw-w-full tw-cursor-pointer tw-flex-row-reverse tw-justify-between tw-rounded-none tw-px-5 tw-py-[10px] tw-text-gray-300 tw-transition-colors tw-duration-150 hover:tw-bg-gray-800/40 hover:tw-text-gray-100'
              }
              key={index}
              locale={index}
              onClick={() => localStorage.setItem('language', index)}
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
    </DropdownMenu.SubContent>
  )

  return (
    <div
      className={`tw-w-ful tw-sticky tw-top-0 tw-backdrop-blur-md ${
        show ? '' : 'tw-top-[-78px] sm:tw-top-[0px]'
      } tw-z-50 tw-border-0 tw-border-b tw-border-solid tw-border-gray-850 tw-transition-all tw-duration-300 ${
        lastScrollY > 200
          ? 'tw-bg-gray-900/90'
          : 'tw-border-none tw-bg-gray-900/0'
      }`}
    >
      <div className="tw-m-auto tw-max-w-[1240px] tw-px-3 lg:tw-px-8">
        <nav
          className={`tw-flex tw-flex-row tw-items-center tw-justify-between tw-py-5 lg:tw-py-3`}
          id="navbar"
        >
          <Link
            href="/"
            className="tw-block tw-h-fit sm:tw-h-[28px]"
            aria-label="Home page"
          >
            <Icon.LogoProBot />
          </Link>
          <NavMenu />
          <div className="tw-flex tw-items-center">
            <div className="tw-flex tw-items-center tw-gap-4"></div>
            {loading ? (
              <LoadingSpinner />
            ) : user ? (
              <DropdownMenu.Root
                onOpenChange={() => setDropdown(false)}
                dir={rtl ? 'rtl' : 'ltr'}
              >
                <DropdownMenu.Trigger asChild>
                  <div className="tw-relative">
                    {!!user.membership_tier && (
                      <Icon.Membership
                        color={`${
                          user.membership_tier === 1001
                            ? '#9BA4B5'
                            : user.membership_tier === 1002
                            ? '#FFDDAA'
                            : '#38BAFF'
                        }`}
                        className={`tw-absolute tw-left-1/2 tw-top-1/2 tw-h-16 tw-w-16 tw-origin-center tw--translate-x-1/2 tw--translate-y-1/2 tw-transform tw-animate-scaleIn tw-duration-700 hover:tw-rotate-90`}
                      />
                    )}

                    <div
                      style={{
                        border: `2px solid ${
                          user.membership_tier === 1001
                            ? '#9BA4B530'
                            : user.membership_tier === 1002
                            ? '#AD987930'
                            : user.membership_tier === 1003
                            ? '#38BAFF10'
                            : null
                        }`,
                        backgroundColor: `${
                          user.membership_tier === 1001
                            ? '#9BA4B510'
                            : user.membership_tier === 1002
                            ? '#AD987910'
                            : user.membership_tier === 1003
                            ? '#38BAFF10'
                            : null
                        }`
                      }}
                      className={`tw-rounded-full tw-bg-opacity-10 ${
                        !user.membership_tier ? 'tw-p-0' : 'tw-p-1'
                      }`}
                    >
                      <Image
                        className={`tw-block tw-cursor-pointer tw-rounded-full hover:tw-grayscale `}
                        src={user.avatar}
                        alt={user.name}
                        width={!user.membership_tier ? 44 : 38}
                        height={!user.membership_tier ? 44 : 38}
                      />
                    </div>
                  </div>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align={`${rtl ? 'start' : 'end'}`}
                    sideOffset={20}
                    className="tw-min-w-[220px] tw-rounded-lg tw-border tw-border-solid tw-border-[#1E202C] tw-bg-[#171821] tw-px-0 tw-py-2 data-[side=bottom]:tw-animate-slideUpAndFade data-[side=left]:tw-animate-slideRightAndFade data-[side=right]:tw-animate-slideLeftAndFade data-[side=top]:tw-animate-slideDownAndFade"
                  >
                    <DropdownItem href="dashboard">
                      {strings.dashboard}
                    </DropdownItem>
                    <DropdownItem
                      outside={true}
                      href="https://discord.gg/probot"
                    >
                      {strings.support}
                    </DropdownItem>
                    <DropdownItem href="commands">
                      {strings.commands}
                    </DropdownItem>
                    <DropdownItem outside={true} href="https://docs.probot.io">
                      {strings.docs}
                    </DropdownItem>
                    <DropdownMenu.Separator className="tw-my-2 tw-h-[1px] tw-w-full tw-border-[#272a37] tw-bg-[#1E202C]" />
                    <DropdownItem membership="true" href="pricing">
                      <p
                        className={`tw-m-0 tw-select-none tw-font-[500] tw-text-[#EFB442] tw-transition-all tw-duration-200 `}
                      >
                        {strings.premium}
                      </p>
                      <img
                        className={`tw-transition-all tw-duration-150`}
                        src="/static/landing/premium.svg"
                        alt="premium"
                      />
                    </DropdownItem>
                    <DropdownItem membership="true" href="memberships">
                      {strings.membership}
                    </DropdownItem>
                    <DropdownItem href="daily">{strings.daily}</DropdownItem>
                    <DropdownMenu.Separator className="tw-my-2 tw-h-[1px] tw-w-full tw-border-[#272a37] tw-bg-[#1E202C]" />

                    {/* SUB */}
                    <DropdownMenu.Sub open={dropdown}>
                      <DropdownMenu.SubTrigger
                        onClick={() => setDropdown(!dropdown)}
                        className="tw-flex tw-w-full tw-cursor-pointer tw-justify-between tw-rounded-none tw-px-5 tw-py-[10px] tw-text-gray-300 tw-outline-none tw-transition-colors tw-duration-150 hover:tw-bg-gray-800/40 hover:tw-text-gray-100"
                      >
                        <p className="tw-m-0 tw-text-sm tw-font-medium tw-text-gray-300">
                          {lang[language].name}
                        </p>
                        <div className="tw-flex tw-gap-2">
                          <Image
                            className="tw-rounded"
                            alt={`${language} flag`}
                            width={28}
                            height={20}
                            src={`/static/flags/${lang[language]?.flag}.png`}
                            draggable={false}
                          />
                          <Image
                            width={13}
                            height={20}
                            className="tw-mr-1 tw-opacity-60"
                            src="/static/landing/arrow-down.svg"
                            alt={language}
                          />
                        </div>
                      </DropdownMenu.SubTrigger>

                      <DropdownMenu.Portal>
                        <LanguagesMenu />
                      </DropdownMenu.Portal>
                    </DropdownMenu.Sub>
                    <DropdownMenu.Separator className="tw-my-2 tw-h-[1px] tw-w-full tw-border-[#272a37] tw-bg-[#1E202C]" />
                    <DropdownItem logout="true">{strings.LOGOUT}</DropdownItem>
                    <DropdownMenu.Arrow className="tw-fill-[#1E202C]" />
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <Button
                onClick={() => auth('auth')}
                className={`tw-text-sm ${user ? 'tw-hidden' : ''}`}
                intent="primary"
                size="small"
              >
                {strings.login}
              </Button>
            )}
          </div>
        </nav>
      </div>
    </div>
  )
}

const NavMenu = () => {
  return (
    <NavigationMenu.Root className="tw-relative tw-flex tw-w-screen tw-max-w-[65%] tw-items-center tw-justify-center sm:tw-hidden">
      <NavigationMenu.List className="tw-center tw-m-0 tw-flex tw-list-none tw-items-center tw-rounded-[6px] tw-bg-none tw-p-1">
        {/* Features  */}
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="nav_menu_trigger tw-m-0 tw-flex tw-cursor-pointer tw-select-none tw-items-center tw-gap-2 tw-rounded-md tw-border-none tw-bg-transparent tw-bg-none tw-px-4 tw-py-2 tw-font-bold tw-text-gray-400 tw-outline-none tw-transition-all tw-duration-200  tw-ease-in  hover:tw-bg-gray-850 hover:tw-text-gray-100">
            {strings.features}
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 5L6.92269 8.91158L10.8454 5"
                stroke="#828699"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="tw-absolute tw-left-0 tw-top-0 data-[motion=from-end]:tw-animate-enterFromRight data-[motion=from-start]:tw-animate-enterFromLeft data-[motion=to-end]:tw-animate-exitToRight data-[motion=to-start]:tw-animate-exitToLeft sm:tw-w-auto">
            <FlyoutMenu />
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        {/* Reso  */}
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="nav_menu_trigger tw-m-0 tw-flex tw-cursor-pointer tw-select-none tw-items-center tw-gap-2 tw-rounded-md tw-border-none tw-bg-transparent tw-bg-none tw-px-4 tw-py-2 tw-font-bold tw-text-gray-400 tw-outline-none tw-transition-all  tw-duration-200  hover:tw-bg-gray-850 hover:tw-text-gray-100">
            {strings.landing_resources}
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 5L6.92269 8.91158L10.8454 5"
                stroke="#828699"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="tw-absolute tw-left-0 tw-top-0 data-[motion=from-end]:tw-animate-enterFromRight data-[motion=from-start]:tw-animate-enterFromLeft data-[motion=to-end]:tw-animate-exitToRight data-[motion=to-start]:tw-animate-exitToLeft sm:tw-w-auto">
            <FlyoutMenu reso={true} />
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        {/* Premium  */}
        <NavigationMenu.Item>
          <Link
            href={'/pricing'}
            className={`tw-flex tw-cursor-pointer tw-items-center tw-gap-2 tw-rounded-md tw-px-4 tw-py-2 tw-transition-all tw-duration-300 hover:tw-bg-[#EFB442]/10`}
          >
            <p
              className={`tw-m-0 tw-select-none tw-font-bold tw-text-[#EFB442] tw-transition-all tw-duration-200 `}
            >
              {strings.premium}
            </p>
            <Image
              width={21}
              height={20}
              className={`tw-transition-all tw-duration-150`}
              src="/static/landing/premium.svg"
              alt="premium"
            />
          </Link>
        </NavigationMenu.Item>

        <NavigationMenu.Indicator className="tw-top-full tw-z-[1] tw-flex tw-h-[10px] tw-items-center tw-justify-center tw-overflow-hidden tw-transition-[width,transform_250ms_ease] data-[state=hidden]:tw-animate-fadeOut data-[state=visible]:tw-animate-fadeIn">
          <div className="tw-relative tw-top-[70%] tw-h-[10px] tw-w-[10px] tw-rotate-[45deg] tw-rounded-tl-[2px] tw-bg-gray-800" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>
      <div className="tw-absolute tw-left-0 tw-top-full tw-w-full tw-items-center tw-perspective-[2000px]">
        <NavigationMenu.Viewport className="tw-absolute tw-mt-[10px] tw-flex tw-h-[var(--radix-navigation-menu-viewport-height)] tw-w-full tw-origin-[top_center] tw-overflow-hidden tw-rounded-[6px] tw-transition-[width,_height] tw-duration-300 data-[state=closed]:tw-animate-scaleOut data-[state=open]:tw-animate-scaleIn" />
      </div>
    </NavigationMenu.Root>
  )
}
