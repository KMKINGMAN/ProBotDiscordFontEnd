import Premium from 'components/LandingPage/PremiumPage/index.tsx'
import strings from '@script/locale'
import Head from 'next/head'

const pricing = () => {
  return (
    <>
      <Head>
        <title>{strings.premium_index_1}</title>
        <meta
          name="description"
          content="Imagine your current Discord server, Just 10 times clear and easier for members to interact, Socialize and play."
        />
        <meta property="og:title" content="Take ProBot to a New Adventure" />
        <meta
          property="og:description"
          content="Imagine your current Discord server, Just 10 times clear and easier for members to interact, Socialize and play."
        />
        <meta name="twitter:title" content="ProBot" />
        <meta
          name="twitter:description"
          content="Imagine your current Discord server, Just 10 times clear and easier for members to interact, Socialize and play."
        />
      </Head>
      <Premium />
    </>
  )
}

export default pricing
