import Loading from '@component/loader'
import { Context } from '@script/_context'
import axios from 'axios'
import Dropdown from '@component/dropdown'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { INITIAL_EMBED_DATA } from '@script/constants'
import { useRouter } from 'next/router'
import Input from '@component/Input'
import Link from 'next/link'
import Pt from '@style/PagesTitle.module.css'
import strings from '@script/locale'
import Confirm from '@component/Confirm'

export default function () {
  const router = useRouter()
  const { Toast, guild, setGuild } = useContext(Context)
  const [loading, setLoading] = useState(true)
  const [composing, setComposing] = useState(false)
  const [search, setSearch] = useState('')
  const [sureDelete, setSureDelete] = useState({
    status: false,
    loading: false,
    embed: {
      id: '',
      name: ''
    }
  })

  const getEmbeds = async () => {
    try {
      const { data } = await axios.get(`/guilds/${guild.id}/embeds`)
      setGuild({
        ...guild,
        embeds: data.map((embed) => ({
          ...embed,
          reactions: JSON.parse(embed.reactions || '[]')
        }))
      })
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (guild.embeds) return setLoading(false)
    getEmbeds()
  }, [guild])

  const compose = async (newEmbed) => {
    try {
      setComposing(true)

      const { data } = await axios.put('/', {
        access: localStorage.ac,
        method: 'ADD_EMBED',
        guild_id: guild.id,
        embed: {
          ...INITIAL_EMBED_DATA,
          ...(newEmbed || {}),
          embed: {
            ...INITIAL_EMBED_DATA.embed,
            ...(newEmbed?.embed || {})
          }
        }
      })
      if (data) {
        setGuild({ ...guild, embeds: [...guild.embeds, data] })
        router.push(`/server/${guild.id}/embed/${data.id}`)
      }
    } catch (error) {
      console.log(error)
      Toast.fire({
        icon: 'error',
        title: "Can't create embed message"
      })
    } finally {
      setComposing(false)
    }
  }

  const deleteEmbed = async () => {
    try {
      setSureDelete({ ...sureDelete, loading: true })
      const { data } = await axios.put('/', {
        access: localStorage.ac,
        method: 'DELETE_EMBED',
        guild_id: guild.id,
        embed_id: sureDelete.embed.id
      })
      if (data) {
        setGuild({ ...guild, embeds: data })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setSureDelete({
        status: false,
        loading: false,
        embed: {
          id: '',
          name: ''
        }
      })
    }
  }

  if (loading) return <Loading />
  return (
    <>
      <Confirm
        title="are_you_sure"
        text={strings.formatString(
          strings.do_you_really,
          sureDelete.embed.name
        )}
        show={sureDelete.status}
        onConfirm={deleteEmbed}
        onCancel={() =>
          setSureDelete({
            status: false,
            loading: false,
            embed: {
              id: '',
              name: ''
            }
          })
        }
        loading={sureDelete.loading}
      />
      <div className={`${Pt['pages-title']} ${Pt['embed-page-title']}`}>
        <div>
          <h3 className="mt-10">{strings.embeder}</h3>
        </div>
      </div>
      <div className="mt-20">
        <div>
          <label htmlFor="embed-name" className="control-label">
            {strings.embed_search_by_name}
          </label>
          <Input
            type="text"
            placeholder={strings.embed_name}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-20">
          <label className="control-label">{strings.embeder}</label>
        </div>
        <div className="embeds-list--wrapper">
          <button
            className="create-embed"
            onClick={() => {
              compose(false)
            }}
            disabled={composing}
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.5 1.91666C6.21959 1.91666 1.91667 6.21957 1.91667 11.5C1.91667 16.7804 6.21959 21.0833 11.5 21.0833C16.7804 21.0833 21.0833 16.7804 21.0833 11.5C21.0833 6.21957 16.7804 1.91666 11.5 1.91666ZM15.3333 12.2187H12.2188V15.3333C12.2188 15.7262 11.8929 16.0521 11.5 16.0521C11.1071 16.0521 10.7813 15.7262 10.7813 15.3333V12.2187H7.66667C7.27376 12.2187 6.94792 11.8929 6.94792 11.5C6.94792 11.1071 7.27376 10.7812 7.66667 10.7812H10.7813V7.66666C10.7813 7.27374 11.1071 6.94791 11.5 6.94791C11.8929 6.94791 12.2188 7.27374 12.2188 7.66666V10.7812H15.3333C15.7263 10.7812 16.0521 11.1071 16.0521 11.5C16.0521 11.8929 15.7263 12.2187 15.3333 12.2187Z"
                fill="#9292A0"
              />
            </svg>
            <span>{strings.rr_create_embed}</span>
          </button>
          {guild?.embeds
            ?.filter((embed) =>
              embed.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((embed) => (
              <Link
                key={embed.id}
                href={`/server/${guild.id}/embed/${embed.id}`}
                className="embeds-list--item"
              >
                <div>
                  <h3>{embed.name}</h3>
                </div>
                <div className="action">
                  <Dropdown
                    trigger={'click'}
                    overlay={
                      <ul className="dropdown__content--embed-actions tw-p-3">
                        <Link href={`/server/${guild.id}/embed/${embed.id}`}>
                          <li>{strings.EDIT}</li>
                        </Link>
                        <button
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            compose(embed)
                          }}
                        >
                          <li>{strings.duplicate}</li>
                        </button>
                        <button
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            setSureDelete({
                              ...sureDelete,
                              status: true,
                              embed: {
                                id: embed.id,
                                name: embed.name
                              }
                            })
                          }}
                          className="delete"
                        >
                          <li>{strings.delete}</li>
                        </button>
                      </ul>
                    }
                  >
                    <button className="show-actions">
                      <svg
                        width="23"
                        height="23"
                        viewBox="0 0 23 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="11.5" cy="4.5" r="1.5" fill="#9292A0" />
                        <circle cx="11.5" cy="11.5" r="1.5" fill="#9292A0" />
                        <circle cx="11.5" cy="18.5" r="1.5" fill="#9292A0" />
                      </svg>
                    </button>
                  </Dropdown>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  )
}
