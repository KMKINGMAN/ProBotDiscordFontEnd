import FeaturePage from '../../components/LandingPage/FeaturePage'
import Head from 'next/head'
import strings from '@script/locale'

export default function embedSystem() {
  const content = {
    featureTagData: {
      content: [
        strings.features_embed_messages_modify_title,
        strings.features_embed_messages_edit_title,
        strings.features_embed_messages_preview_title
      ],
      color: '#46E78A'
    },
    heroSectionData: {
      tag: strings.embeder,
      headline: strings.landing_embed_messages_title,
      desc: strings.landing_embed_messages_description,
      img: '/static/landing/embed.svg',
      featureIcon: '/static/landing/features/embed/embed-icon.svg',
      btnGetStarted: strings.landing_get_started,
      color: '#46E78A'
    },
    features: [
      {
        id: 1,
        title: strings.features_embed_messages_modify_title,
        desc: strings.features_embed_messages_modify_description,
        btn: strings.feautres_learn_more,
        img: '/static/landing/features/embed/first-feat.svg',
        reversed: true,
        link: 'https://docs.probot.io/docs/modules/embed'
      },
      {
        id: 2,
        title: strings.features_embed_messages_edit_title,
        desc: strings.features_embed_messages_edit_description,
        btn: strings.feautres_learn_more,
        img: '/static/landing/features/embed/sec-feat.svg',
        reversed: false,
        link: 'https://docs.probot.io/docs/modules/embed'
      },
      {
        id: 3,
        title: strings.features_embed_messages_preview_title,
        desc: strings.features_embed_messages_preview_description,
        btn: strings.feautres_learn_more,
        img: '/static/landing/features/embed/third-feat.svg',
        reversed: true,
        link: 'https://docs.probot.io/docs/modules/embed'
      }
    ],
    otherFeatures: [
      {
        tag: strings.landing_welcome_messages_tag,
        headline: strings.landing_welcome_messages_title,
        featureIcon: '/static/landing/features/welcome/welcome-icon.svg',
        link: 'welcome-messages',
        color: '#5753EC'
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
        <title>Embed Messages</title>
        <meta
          name="description"
          content="Illustrate your creativity in embeds by using ProBot's simple customization and sending it to any preferred channel."
        />
        <meta
          property="og:title"
          content="Easily create embeds for your server!"
        />
        <meta
          property="og:description"
          content="Illustrate your creativity in embeds by using ProBot's simple customization and sending it to any preferred channel."
        />
        <meta name="twitter:title" content="ProBot" />
        <meta
          name="twitter:description"
          content="Illustrate your creativity in embeds by using ProBot's simple customization and sending it to any preferred channel."
        />
      </Head>

      <FeaturePage content={content} />
    </>
  )
}
