import { useCallback, useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios'
import PagesTitle from '@component/PagesTitle'
import strings from '@script/locale'
import { Card } from '../../dashboard'
import { Context, socket } from '@script/_context'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import moment from 'moment'
import { useRouter } from 'next/router'
import Select from 'react-select'

export default function Dashboard() {
  const router = useRouter()
  const { guild_id } = router.query

  const { guild } = useContext(Context)
  const [stats, setStats] = useState([])
  const [dailyStats, setDailyStats] = useState(undefined)
  const [selected, setSelected] = useState('7')

  const STATUS_DAYS_LIST = [
    { value: '7', label: strings.stats_7 },
    { value: '14', label: strings.stats_14 },
    { value: '30', label: strings.stats_month },
    {
      value: '90',
      label: strings.stats_3_months,
      isDisabled: guild.botnumber < 2
    },
    {
      value: '180',
      label: strings.stats_6_months,
      isDisabled: guild.botnumber < 2
    },
    {
      value: '360',
      label: strings.stats_1_year,
      isDisabled: guild.botnumber < 2
    }
  ]
  const onSocketGuildMessage = useCallback(
    (e) => {
      if (e.id !== guild.id) return
      console.log(`[WEBSOCKET] [GUILD] [daily_stats]`, e)
      setDailyStats(e)
    },
    [guild]
  )

  useEffect(() => {
    socket.on('daily_stats', onSocketGuildMessage)
    return () => socket.removeListener('daily_stats', onSocketGuildMessage)
  }, [onSocketGuildMessage])

  useEffect(() => {
    let isMounted = true

    axios.get(`guilds/${guild_id}/stats?duration=1`).then((response) => {
      if (isMounted) {
        console.log('today', response.data)
        setDailyStats(response.data)
      }
    })

    return () => {
      isMounted = false
    }
  }, [guild_id])

  // axios
  //     .get(`guilds/${guild_id}/stats?duration=${selected}`)
  //     .then((response) => {
  //       if (isMounted) {
  //         console.log(`${selected} DAYS STATS`, response.data);
  //         setStats(response.data);
  //       }
  //     });

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get(
          `guilds/${guild_id}/stats?duration=${selected}`
        )
        setStats(data)
        console.log(`${selected} DAYS STATS`, data)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [guild_id, selected])

  return (
    <div>
      <PagesTitle data={{ name: 'OVERVIEW' }} />
      <Head>
        <title>
          {guild?.name || 'Unknown'} - {strings.probot}
        </title>
      </Head>

      <div className="component-container mt-30">
        <div className="row ms-1 me-1 gap-3 mb-3 ">
          <Card
            title={strings.new_messages}
            loading={!dailyStats}
            amount={dailyStats?.messages}
            colorsStyle="credits"
            icon="fa-comments"
            description={strings.overview_time}
          />
          <Card
            title={strings.join_leaves}
            loading={!dailyStats}
            amount={`${dailyStats?.joined}/${dailyStats?.left}`}
            colorsStyle="level"
            icon="fa-user-plus"
            description={strings.overview_time}
          />
          <Card
            title={strings.TOTAL_MEMBERS}
            loading={!dailyStats}
            amount={dailyStats?.members}
            colorsStyle="reputation"
            icon="fa-users"
          />
        </div>

        <h5>{strings.charts_over}</h5>
        <Select
          classNamePrefix="formselect"
          placeholder={strings.CHART_7_DAYS}
          value={STATUS_DAYS_LIST.find((o) => o.value === selected)}
          options={STATUS_DAYS_LIST}
          onChange={({ value }) => setSelected(value)}
        />

        <div className="row row-cols-1 mt-2 row-cols-lg-2">
          <div className="col">
            <div
              className="black-container col"
              style={{
                height: '300px'
              }}
            >
              {strings.JOINS_LEAVES}
              <ResponsiveContainer>
                <AreaChart
                  data={
                    stats?.map?.((s) => ({
                      date: moment(s.date).format('YYYY-MM-DD'),
                      joins: s.joined || 0,
                      leaves: s.left || 0
                    })) || []
                  }
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0
                  }}
                >
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="joins"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                  />
                  <Area
                    type="monotone"
                    dataKey="leaves"
                    stackId="2"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col">
            <div
              className="black-container col"
              style={{
                height: '300px'
              }}
            >
              {strings.server_index_memberflow}
              <ResponsiveContainer>
                <AreaChart
                  data={
                    stats?.map?.((s) => ({
                      date: moment(s.date).format('YYYY-MM-DD'),
                      members: s.members || 0
                    })) || []
                  }
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0
                  }}
                >
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="members"
                    stackId="1"
                    stroke="#705be1"
                    fill="#705be1"
                  />
                  <Area
                    type="monotone"
                    dataKey="online"
                    stackId="2"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <div
              className="black-container"
              style={{
                height: '300px'
              }}
            >
              {strings.MESSAGE_STATS}
              <ResponsiveContainer>
                <AreaChart
                  data={
                    stats?.map?.((s) => ({
                      date: moment(s.date).format('YYYY-MM-DD'),
                      messages: s.messages || 0
                    })) || []
                  }
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0
                  }}
                >
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="messages"
                    stackId="1"
                    stroke="#e2409e"
                    fill="#e2409e"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
