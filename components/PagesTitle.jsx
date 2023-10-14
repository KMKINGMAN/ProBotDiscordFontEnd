import Pt from '@style/PagesTitle.module.css'
import Switch from 'react-switch'
import axios from 'axios'
import { useCallback, useContext } from 'react'
import { Context } from '@script/_context'
import strings from '@script/locale'
import debounce from 'lodash/debounce'
import Head from 'next/head'

export default function PagesTitle({ needInput, className, data }) {
  const { guild, setGuild } = useContext(Context)

  const changeModule = useCallback(
    debounce((module, bool) => {
      axios.put(`/guilds/${guild.id}/modules/${encodeURIComponent(module)}`, {
        enabled: bool
      })
    }, 800),
    []
  )

  if (!data) return <></>
  return (
    <div className={`${Pt['pages-title']} ${className}`}>
      <Head>
        <title>
          {strings[data.name]} ({guild.name}) - {strings.probot}
        </title>
      </Head>
      <div>
        <h3
          className="mt-10"
          onClick={() => {
            changeModule(data.module, !guild.modules[data.module])
            setGuild({
              ...guild,
              modules: {
                ...guild.modules,
                [data.module]: !guild.modules[data.module]
              }
            })
          }}
        >
          {strings[data.name] || data.name}
        </h3>
        {!!strings[data.description] && (
          <p className="tw-text-grey-text3 tw-text-base tw-font-semibold">
            {strings[data.description]}
          </p>
        )}
      </div>
      <div>
        {data && data.module && (
          <Switch
            checked={
              guild?.modules?.[data.module] === undefined ||
              guild?.modules?.[data.module]
            }
            value={
              guild?.modules?.[data.module] === undefined ||
              guild?.modules?.[data.module]
            }
            onChange={() => {
              changeModule(data.module, !guild.modules[data.module])
              setGuild({
                ...guild,
                modules: {
                  ...guild.modules,
                  [data.module]: !guild.modules[data.module]
                }
              })
            }}
            onColor="#42FFA7"
            handleDiameter={37}
            height={40}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            aria-label="reaction role"
            width={80}
            className="dramexSwi"
            id="material-switch"
            disabled={data.disabled}
          />
        )}
        {needInput && <input className="switch-checkbox" type="checkbox" />}
      </div>
    </div>
  )
}
