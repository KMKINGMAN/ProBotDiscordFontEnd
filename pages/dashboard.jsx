import { useContext } from 'react'
import Head from 'next/head'
import { Context } from '@script/_context'
import style from '@style/overview.module.css'
import strings from '@script/locale'

export function Card({ title, icon, amount, colorsStyle, description }) {
  return (
    <div className={`${style.card} col-md`}>
      <div className={style[colorsStyle]}>
        <i className={`fas ${icon}`}></i>
        <div>
          <h5>{title}</h5>
          {description && <p>{description}</p>}
        </div>
      </div>
      <h3>
        {typeof amount === 'string'
          ? amount.split('undefined').join('00')
          : amount?.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') ||
            '0000'}
      </h3>
    </div>
  )
}

export default function Dashboard() {
  
  const { user } = useContext(Context)

  return (
    <div className={style.container}>
      <Head>
        <title>
          {strings.dashboard} - {strings.probot}
        </title>
      </Head>

      <div className="row ms-1 me-1 mb-3 gap-3">
        <Card
          title={strings.credits}
          colorsStyle="credits"
          icon="fa-cedi-sign"
          amount={user?.credits}
        />
        <Card
          title={strings.level}
          colorsStyle="level"
          icon="fa-star"
          amount={user?.level}
        />
        <Card
          title={strings.rank}
          colorsStyle="rank"
          icon="fa-medal"
          amount={user?.rank}
        />
        <Card
          title={strings.reputation}
          colorsStyle="reputation"
          icon="fa-star"
          amount={user?.rep}
        />
      </div>
    </div>
  )
}
