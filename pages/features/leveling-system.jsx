import FeaturePage from '../../components/LandingPage/FeaturePage'
import Head from 'next/head'
import strings from '@script/locale'

export default function LevelingSystem() {
  const content = {
    featureTagData: {
      content: [
        strings.features_leveling_system_leve_type_title,
        strings.features_leveling_system_no_xp_title,
        strings.features_leveling_system_level_message_title
      ],
      color: '#E3666F'
    },
    heroSectionData: {
      tag: strings.leveling_title,
      headline: strings.landing_leveling_system_title,
      desc: strings.landing_leveling_system_description,
      img: '/static/landing/features/leveling.svg',
      featureIcon: '/static/landing/features/leveling/leveling-icon.svg',
      btnGetStarted: strings.landing_get_started,
      color: '#E3666F'
    },
    features: [
      {
        id: 1,
        title: strings.features_leveling_system_leve_type_title,
        desc: strings.features_leveling_system_leve_type_description,
        btn: strings.feautres_learn_more,
        img: '/static/landing/features/leveling/first-feat.svg',
        reversed: true,
        link: 'https://docs.probot.io/docs/modules/level_system'
      },
      {
        id: 2,
        title: strings.features_leveling_system_no_xp_title,
        desc: strings.features_leveling_system_no_xp_description,
        btn: strings.feautres_learn_more,
        img: '/static/landing/features/leveling/sec-feat.svg',
        reversed: false,
        link: 'https://docs.probot.io/docs/modules/level_system'
      },
      {
        id: 3,
        title: strings.features_leveling_system_level_message_title,
        desc: strings.features_leveling_system_level_message_description,
        btn: strings.feautres_learn_more,
        img: '/static/landing/features/leveling/third-feat.svg',
        reversed: true,
        link: 'https://docs.probot.io/docs/modules/level_system'
      }
    ],
    otherFeatures: [
      {
        tag: strings.embeder,
        headline: strings.features_embed_messages_modify_title,
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
      },
      {
        tag: strings.landing_welcome_messages_tag,
        headline: strings.landing_welcome_messages_title,
        featureIcon: '/static/landing/features/welcome/welcome-icon.svg',
        link: 'welcome-messages',
        color: '#5753EC'
      }
    ]
  }

  return (
    <>
      <Head>
        <title>Leveling System</title>
        <meta
          name="description"
          content="Reward active members with special level roles, privileged permissions, and channels as they reach a certain level!"
        />
        <meta
          property="og:title"
          content="Reward your most Active and Engaged Members"
        />
        <meta
          property="og:description"
          content="Reward active members with special level roles, privileged permissions, and channels as they reach a certain level!"
        />
        <meta name="twitter:title" content="ProBot - Leveling System" />
        <meta
          name="twitter:description"
          content="Reward active members with special level roles, privileged permissions, and channels as they reach a certain level!"
        />
      </Head>

      <FeaturePage content={content} />
    </>
  )
}
