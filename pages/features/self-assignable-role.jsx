import FeaturePage from '../../components/LandingPage/FeaturePage'
import Head from 'next/head'
import strings from '@script/locale'

export default function LevelingSystem() {
  const content = {
    featureTagData: {
      content: [
        strings.features_self_assignable_role_react_message_title,
        strings.features_self_assignable_role_select_role_title,
        strings.features_self_assignable_role_press_button_title
      ],
      color: '#FFE75C'
    },
    heroSectionData: {
      tag: strings.index_card6_title,
      headline: strings.landing_self_assignable_roles_title,
      desc: strings.landing_self_assignable_roles_description,
      img: '/static/landing/rr.svg',
      featureIcon: '/static/landing/features/rr/rr-icon.svg',
      btnGetStarted: strings.landing_get_started,
      color: '#FFE75C'
    },
    features: [
      {
        id: 1,
        title: strings.features_self_assignable_role_press_button_title,
        desc: strings.features_self_assignable_role_react_message_description,
        btn: strings.feautres_learn_more,
        img: '/static/landing/features/rr/first-feat.svg',
        reversed: true,
        link: 'https://docs.probot.io/docs/modules/self-assignable-roles'
      },
      {
        id: 2,
        title: strings.features_self_assignable_role_select_role_title,
        desc: strings.features_self_assignable_role_select_role_description,
        btn: strings.feautres_learn_more,
        img: '/static/landing/features/rr/sec-feat.svg',
        reversed: false,
        link: 'https://docs.probot.io/docs/modules/self-assignable-roles'
      },
      {
        id: 3,
        title: strings.features_self_assignable_role_react_message_title,
        desc: strings.features_self_assignable_role_react_message_description,
        btn: strings.feautres_learn_more,
        img: '/static/landing/features/rr/third-feat.svg',
        reversed: true,
        link: 'https://docs.probot.io/docs/modules/self-assignable-roles'
      }
    ],
    otherFeatures: [
      {
        tag: strings.embeder,
        headline: strings.features_embed_messages_modify_title,
        featureIcon: '/static/landing/features/embed/embed-icon.svg',
        link: 'embed-messages',
        color: '#46E78A'
      },
      {
        tag: strings.leveling,
        headline: strings.landing_leveling_system_title,
        featureIcon: '/static/landing/features/leveling/leveling-icon.svg',
        link: 'leveling-system',
        color: '#E3666F'
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
        <title>Self Assignable role</title>
        <meta
          name="description"
          content="Set up exclusive reaction roles & buttons, select menus and let your members have the roles they deserve with a single click!"
        />
        <meta
          property="og:title"
          content="React to the messages and get roles!"
        />
        <meta
          property="og:description"
          content="Set up exclusive reaction roles & buttons, select menus and let your members have the roles they deserve with a single click!"
        />
        <meta name="twitter:title" content="ProBot - Self-Assignable Roles" />
        <meta
          name="twitter:description"
          content="Set up exclusive reaction roles & buttons, select menus and let your members have the roles they deserve with a single click!"
        />
      </Head>

      <FeaturePage content={content} />
    </>
  )
}
