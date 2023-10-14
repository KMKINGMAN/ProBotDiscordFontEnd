import FeaturePage from '../../components/LandingPage/FeaturePage'
import Head from 'next/head'
import strings from '@script/locale'

export default function LevelingSystem() {
  const content = {
    featureTagData: {
      content: [
        strings.features_welcome_messages_customizable_title,
        strings.features_welcome_messages_backgorund_title,
        strings.features_welcome_messages_layouts_title
      ],
      color: '#7A77F5'
    },
    heroSectionData: {
      tag: strings.landing_welcome_messages_tag,
      headline: strings.landing_welcome_messages_title,
      desc: strings.landing_welcome_messages_description,
      img: '/static/landing/welcome.svg',
      featureIcon: '/static/landing/features/welcome/welcome-icon.svg',
      btnGetStarted: strings.landing_get_started,
      color: '#5753EC'
    },
    features: [
      {
        id: 1,
        title: strings.features_welcome_messages_customizable_title,
        desc: strings.features_welcome_messages_customizable_description,
        btn: strings.feautres_learn_more,
        img: '/static/landing/features/welcome/first-feat.svg',
        reversed: true,
        link: 'https://docs.probot.io/docs/modules/welcome'
      },
      {
        id: 2,
        title: strings.features_welcome_messages_backgorund_title,
        desc: strings.features_welcome_messages_backgorund_description,
        btn: strings.feautres_learn_more,
        img: '/static/landing/features/welcome/sec-feat.svg',
        reversed: false,
        link: 'https://docs.probot.io/docs/modules/welcome'
      },
      {
        id: 3,
        title: strings.features_welcome_messages_layouts_title,
        desc: strings.features_welcome_messages_layouts_description,
        btn: strings.feautres_learn_more,
        img: '/static/landing/features/welcome/third-feat.svg',
        reversed: true,
        link: 'https://docs.probot.io/docs/modules/welcome'
      }
    ],
    otherFeatures: [
      {
        tag: strings.landing_embed_messages_learn,
        headline: strings.landing_embed_messages_title,
        featureIcon: '/static/landing/features/embed/embed-icon.svg',
        link: 'embed-messages',
        color: '#46E78A'
      },
      {
        tag: strings.landing_leveling_system_learn,
        headline: strings.landing_leveling_system_title,
        featureIcon: '/static/landing/features/leveling/leveling-icon.svg',
        link: 'leveling-system',
        color: '#E3666F'
      },
      {
        tag: strings.landing_self_assignable_roles_learn,
        headline: strings.landing_self_assignable_roles_title,
        featureIcon: '/static/landing/features/rr/rr-icon.svg',
        link: 'self-assignable-role',
        color: '#FFE75C'
      }
    ]
  }

  return (
    <>
      <Head>
        <title>Welcome Messages</title>
        <meta
          name="description"
          content="ProBot allows you to create your own welcome images, which include the user's username and avatar, as well as a customizable background image!"
        />
        <meta
          property="og:title"
          content="Let's Welcome New Members with Style!"
        />
        <meta
          property="og:description"
          content="ProBot allows you to create your own welcome images, which include the user's username and avatar, as well as a customizable background image!"
        />
        <meta name="twitter:title" content="ProBot - Welcome  Messages" />
        <meta
          name="twitter:description"
          content="ProBot allows you to create your own welcome images, which include the user's username and avatar, as well as a customizable background image!"
        />
      </Head>

      <FeaturePage content={content} />
    </>
  )
}
