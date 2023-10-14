import axios from 'axios'
import { useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee'
import * as Icons from './Icons'
import numeral from 'numeral'
import strings from '@script/locale'
import { useRouter } from 'next/router'

interface Stats {
  guilds: number
  members: number
}

export default function Stats() {
  const servers = [
    {
      name: 'PewDiePie | Floor Gang',
      icon: 'https://cdn.discordapp.com/icons/718433475828645928/91d939729e0d708087204ec3739f00f4.jpg?size=128',
      members: '200,000',
      verified: 1
    },
    {
      name: 'PUBG Mobile Mena',
      icon: 'https://cdn.discordapp.com/icons/464973904058777600/8d5776a837bac580a3f05250b286184f.webp?size=128',
      members: '150,000',
      verified: 1
    },
    {
      name: 'oCMz',
      icon: 'https://cdn.discordapp.com/icons/547436115741900801/a3b0bfa23c77afa6769b7bb4ea3dd6fc.webp?size=128',
      members: '170,000',
      verified: 2
    },
    {
      name: 'Jet’s Dream World',
      icon: 'https://cdn.discordapp.com/icons/327892735963037696/a_59bbeadbff44e5a5edef1b7109416969.jpg?size=128',
      members: '400,000',
      verified: 3
    },
    {
      name: 'Aburob Community',
      icon: 'https://cdn.discordapp.com/icons/852009601222049834/c4b07a9c99dd22b86b8fd62dca668ebb.webp?size=128',
      members: '120,000',
      verified: 1
    },
    {
      name: 'Anime Soul Discord',
      icon: 'https://cdn.discordapp.com/icons/290843998296342529/a_5894e1a14e9e565d42be7f1205fc1fa3.jpg?size=128',
      members: '688,000',
      verified: 1
    }
  ]
  const TRservers = [
    {
      name: 'Elraenn',
      icon: 'https://cdn.discordapp.com/attachments/1000451933523419186/1132743131247423518/0294fec8-8572-4517-9b60-12e0705a8893-profile_image-300x300.png',
      members: '410,000',
      verified: 2
    },
    {
      name: 'wtcN',
      icon: 'https://cdn.discordapp.com/icons/275616659266469889/a_72fd445eb617285c425df09b1821f0b3.webp?size=128',
      members: '110,000',
      verified: 2
    },
    {
      name: 'TUGAY GÖK',
      icon: 'https://cdn.discordapp.com/icons/551186470774243363/a_55a9c47107788060d9df89ab6078198a.jpg?size=128',
      members: '110,000',
      verified: 1
    },
    {
      name: 'Adalances',
      icon: 'https://cdn.discordapp.com/icons/381548392012054529/6ea3723f91b20e123f0910bba2c73afe.webp?size=128',
      members: '238,000',
      verified: 2
    },
    {
      name: 'PewDiePie | Floor Gang',
      icon: 'https://cdn.discordapp.com/icons/718433475828645928/91d939729e0d708087204ec3739f00f4.jpg?size=128',
      members: '200,000',
      verified: 1
    }
  ]
  const ARservers = [
    {
      name: 'oCMz',
      icon: 'https://cdn.discordapp.com/icons/547436115741900801/a3b0bfa23c77afa6769b7bb4ea3dd6fc.webp?size=128',
      members: '170,000',
      verified: 2
    },
    {
      name: 'Aburob Community',
      icon: 'https://cdn.discordapp.com/icons/852009601222049834/c4b07a9c99dd22b86b8fd62dca668ebb.webp?size=128',
      members: '120,000',
      verified: 1
    },
    {
      name: 'd7oomy999',
      icon: 'https://cdn.discordapp.com/icons/759413478833782784/a_32eda676fb03c8af650679c60c14bcf9.webp?size=128',
      members: '160,000',
      verified: 1
    },
    {
      name: 'PUBG Mobile Mena',
      icon: 'https://cdn.discordapp.com/icons/464973904058777600/8d5776a837bac580a3f05250b286184f.webp?size=128',
      members: '150,000',
      verified: 1
    },
    {
      name: '3Gaming',
      icon: 'https://cdn.discordapp.com/icons/490539398627328010/eeca575e910263985522281d728db45c.webp?size=128',
      members: '110,000',
      verified: 1
    }
  ]

  const [stats, setStats] = useState({ guilds: 0, members: 0 })
  const { locale } = useRouter()

  useEffect(() => {
    axios.get('/stats').then((response) => setStats(response.data))
  }, [])

  return (
    <div
      data-aos="fade-up"
      className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-[25px]"
    >
      <div className="landing-para tw-text-center tw-text-sm tw-font-bold tw-text-gray-400">
        {strings.formatString(
          strings.landing_servers_trusted,
          <span className={'tw-font-bold tw-text-gray-50'}>9.000,000</span>
        )}
      </div>
      <Marquee
        gradient
        gradientColor={[18, 19, 26]}
        autoFill
        speed={35}
        style={{ direction: 'initial' }}
        className={'tw-overflow-hidden'}
      >
        {(locale === 'tr'
          ? TRservers
          : locale === 'ar'
          ? ARservers
          : servers
        ).map((server, index) => (
          <ServerCard
            key={index}
            name={server.name}
            icon={server.icon}
            members={server.members}
            verified={server.verified}
            delay={100 + index * 200}
          />
        ))}
      </Marquee>
    </div>
  )
}

const ServerCard = ({ name, icon, members, verified, delay }) => {
  return (
    <div
      data-aos-delay={`${delay}`}
      data-aos="fade-up"
      className="tw-ml-[48px] tw-flex tw-items-center tw-gap-4"
    >
      <img
        src={icon}
        className="tw-block tw-h-[48px] tw-w-[48px] tw-rounded"
        alt={name}
      />
      <div className="tw-flex tw-flex-col">
        <div className="tw-flex tw-flex-row tw-items-center tw-gap-1">
          <p className="landing-para">{name}</p>
          {verified === 1 ? (
            <Icons.Verified />
          ) : verified === 2 ? (
            <Icons.Partner />
          ) : null}
        </div>
        <p className="landing-para tw-text-gray-400">{members} Members</p>
      </div>
    </div>
  )
}
