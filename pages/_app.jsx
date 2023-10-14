import Head from 'next/head'
import { Sidebar } from '@component/sidebar'
import Navbar from '@component/navbar'
import strings, { lang } from '@script/locale'
import '@style/global.css'
import '@style/variables.css'
import '@style/landing.css'
import Provider from '@script/_context'
import App from '@component/app'
import { motion } from 'framer-motion'
import Premium from './pricing'
import '@component/embed/css/index.css'
import '@component/embed/css/discord.css'
import 'highlight.js/styles/base16/solarized-dark.css'
import 'rc-tooltip/assets/bootstrap.css'
import 'rc-slider/assets/index.css'
import '@style/dropdown.css'
import '@style/editor.css'
import { useEffect } from 'react'

function MyApp({ Component, router }) {
  if (router.locale) strings.setLanguage(router.locale)
  const excludedRoutes = [
    '/',
    '/pricing',
    '/commands',
    '/refund-policy',
    '/terms-of-use',
    '/privacy-policy'
  ]

  const dir = router.locale === 'ar' || router.locale === 'fa' ? 'rtl' : 'ltr'
  useEffect(() => {
    document.documentElement.dir = dir
  }, [dir])

  return (
    <>
      <Head>
        <title>{strings.title}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=2"
        />
        <link
          rel="alternate"
          href={`https://probot.io${router.asPath}`}
          hrefLang="en"
        />
        <link
          rel="alternate"
          href={`https://probot.io${router.asPath}`}
          hrefLang="x-default"
        />
        {Object.keys(lang)
          .filter((lang) => lang !== 'en')
          .map((key) => (
            <link
              key={key}
              rel="alternate"
              href={`https://probot.io/${key}${
                router.asPath.length === 1 ? '' : router.asPath
              }`}
              hrefLang={key}
            />
          ))}
      </Head>
      <Provider router={router} strings={strings}>
        {excludedRoutes.includes(router.route) ||
        router.route.startsWith('/features') ? null : (
          <Navbar />
        )}
        <App>
          <Sidebar>
            {router.route !== '/' ? (
              <motion.div
                key={router.route}
                initial="initial"
                animate="animate"
                variants={{
                  initial: {
                    opacity: 0
                  },
                  animate: {
                    opacity: 1
                  }
                }}
              >
                <Component />
              </motion.div>
            ) : (
              <Component />
            )}
          </Sidebar>
        </App>
      </Provider>
    </>
  )
}

export default MyApp
