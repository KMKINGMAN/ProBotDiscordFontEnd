import Feature from './Feature'
import 'aos/dist/aos.css'
import strings from '@script/locale'

export default function Features() {
  const featuresContent = [
    {
      id: 1,
      tag: strings.landing_welcome_messages_tag,
      title: strings.landing_welcome_messages_title,
      desc: strings.landing_welcome_messages_description,
      btn: strings.landing_welcome_messages_learn,
      img: 'static/landing/welcome.svg',
      reversed: true,
      link: '/features/welcome-messages',
      icon: 'static/landing/features/welcome/welcome-icon.svg'
    },
    {
      id: 2,
      tag: strings.embeder,
      title: strings.landing_embed_messages_title,
      desc: strings.landing_embed_messages_description,
      btn: strings.landing_embed_messages_learn,
      img: 'static/landing/embed.svg',
      reversed: false,
      link: '/features/embed-messages',
      icon: 'static/landing/features/embed/embed-icon.svg'
    },
    {
      id: 3,
      tag: strings.reaction_roles,
      title: strings.landing_self_assignable_roles_title,
      desc: strings.landing_self_assignable_roles_description,
      btn: strings.landing_self_assignable_roles_learn,
      img: 'static/landing/rr.svg',
      reversed: true,
      link: '/features/self-assignable-role',
      icon: 'static/landing/features/rr/rr-icon.svg'
    },
    {
      id: 4,
      tag: strings.index_card3_title,
      title: strings.landing_leveling_system_title,
      desc: strings.landing_leveling_system_description,
      btn: strings.landing_leveling_system_learn,
      img: 'static/landing/leveling.svg',
      reversed: false,
      link: '/features/leveling-system',
      icon: 'static/landing/features/leveling/leveling-icon.svg'
    }
  ]
  return (
    <section
      id="features"
      className="tw-flex tw-flex-col tw-gap-56 tw-py-64 tw-pb-0 sm:tw-gap-28 sm:tw-py-40 sm:tw-pb-0"
    >
      {featuresContent.map((feature, index) => (
        <Feature key={index} feature={feature} />
      ))}
    </section>
  )
}
