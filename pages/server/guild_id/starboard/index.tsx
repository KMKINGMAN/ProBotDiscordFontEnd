import { useContext, useState } from 'react'
import PagesTitle from '@component/PagesTitle'
import Dropdown from '@component/dropdown'
import Link from 'next/link'
import { Context } from '@script/_context'
import axios from 'axios'
import strings from '@script/locale'
import Confirm from '@component/Confirm'
import Command from '@component/Command'
import { useRouter } from 'next/router'
import Emoji from '@component/emoji-picker/Emoji'

const LoadingIcon = (
  <svg
    className="tw--ml-1 tw--mr-2 tw-h-4 tw-w-4 tw-animate-spin tw-text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="tw-opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="tw-opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
)

const starEmoji = {
  asset: null,
  category: 'nature',
  id: 'star',
  name: 'star',
  native: '⭐'
}

export default function Starboard() {
  const router = useRouter()
  const { guild, Toast, setGuild } = useContext(Context)
  const [loading, setLoading] = useState({
    creating: false,
    duplicating: false
  })
  const [sureDelete, setSureDelete] = useState<any>({
    status: false,
    loading: false,
    board: null
  })

  const handleDelete = async () => {
    try {
      setSureDelete({ ...sureDelete, loading: true })
      await axios.delete(`/guilds/${guild.id}/starboard/${sureDelete.board.id}`)
      setGuild({
        ...guild,
        starboard: guild.starboard.filter(
          (item: any) => item.id !== sureDelete.board.id
        )
      })
      Toast.fire({
        icon: 'success',
        title: 'Starboard deleted'
      })
    } catch (error) {
      console.log(error)
      Toast.fire({
        icon: 'error',
        title: "Can't delete starboard"
      })
    } finally {
      setSureDelete({
        status: false,
        loading: false,
        board: null
      })
    }
  }

  const createNewStarboard = async (duplicateData?: any) => {
    try {
      if (duplicateData) {
        setLoading({
          ...loading,
          duplicating: duplicateData.id
        })
      } else {
        setLoading({
          ...loading,
          creating: true
        })
      }

      const payload = duplicateData ? duplicateData : null

      const { data } = await axios.post(
        `/guilds/${guild.id}/starboard`,
        payload
      )
      setGuild({
        ...guild,
        starboard: guild.starboard ? [...guild.starboard, data] : [data]
      })
      router.push(`/server/${guild.id}/starboard/${data.id}`)
    } catch (error) {
      console.log(error)
      Toast.fire({
        icon: 'error',
        title: "Can't create new starboard"
      })
    } finally {
      setLoading({
        duplicating: false,
        creating: false
      })
    }
  }

  return (
    <>
      <PagesTitle
        className="tw-mb-6"
        needInput={false}
        data={{
          name: strings.starboard,
          description: 'Start creating a special messages channel',
          module: 'starboard'
        }}
      />

      <Confirm
        title="are_you_sure"
        text={strings.formatString(
          strings.do_you_really,
          sureDelete.board?.name ?? ''
        )}
        show={sureDelete.status}
        onConfirm={handleDelete}
        onCancel={() =>
          setSureDelete({
            status: false,
            loading: false,
            board: null
          })
        }
        loading={sureDelete.loading}
      />
      <div className="tw-mb-8 tw-flex tw-items-start">
        <button
          onClick={() => createNewStarboard()}
          className="tw-btn-primary tw-btn-icon tw-min-w-[66px] tw-max-w-[220px]"
          disabled={loading.creating}
        >
          <span>{strings.starboard_create}</span>
          {loading.creating && LoadingIcon}
        </button>
      </div>

      <div className="tw-mt-6 tw-flex tw-flex-col tw-gap-2 tw-rounded-2xl">
        {guild.starboard?.map((item, index) => (
          <div
            key={index}
            className="tw-flex tw-justify-between tw-rounded tw-bg-grey-4 tw-p-4 hover:tw-bg-grey-4 tw-duration-200"
          >
            <Link
              href={`/server/${guild.id}/starboard/${item.id}`}
              className="tw-flex tw-items-center tw-gap-4 tw-group"
            >
              <div className="tw-flex tw-items-center tw-justify-center tw-rounded-[5px] tw-bg-grey-3 tw-p-1 tw-pt-[2px]">
                {item.emoji ? (
                  // @ts-ignore
                  <Emoji emoji={item.emoji} />
                ) : (
                  // @ts-ignore
                  <Emoji emoji={starEmoji} />
                  // <div>hi</div>
                )}
              </div>
              <div className="tw-flex tw-flex-col tw-gap-1">
                <span className="tw-text-base tw-text-white">{item.name}</span>
                <span className="tw-text-sm tw-text-grey-text2 group-hover:tw-text-grey-text3 tw-duration-200">
                  {item.channel
                    ? '#' +
                      guild.channels.find((ch) => ch.id === item.channel)?.name
                    : '#unknown'}
                </span>
              </div>
            </Link>
            <div className="tw-flex tw-items-center tw-gap-4">
              <Link href={`/server/${guild.id}/starboard/${item.id}`}>
                <button className="tw-btn tw-min-w-[66px]">
                  {strings.EDIT}
                </button>
              </Link>
              <Dropdown
                trigger={'click'}
                overlay={
                  <ul className="dropdown__content--embed-actions tw-p-3">
                    <button
                      onClick={(event) => {
                        if (loading.duplicating === item.id) return
                        event.preventDefault()
                        event.stopPropagation()
                        createNewStarboard(item)
                      }}
                    >
                      <li className="tw-flex tw-items-center tw-gap-4">
                        {loading.duplicating === item.id && LoadingIcon}
                        <span>{strings.duplicate}</span>
                      </li>
                    </button>

                    <button
                      onClick={() => {
                        setSureDelete({
                          ...sureDelete,
                          status: true,
                          board: item
                        })
                      }}
                      className="delete"
                    >
                      <li>{strings.delete}</li>
                    </button>
                  </ul>
                }
              >
                <div className="tw-pt-1 group inline-block tw-cursor-pointer">
                  <svg
                    width="23"
                    height="24"
                    viewBox="0 0 23 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="tw-fill-[#9292A0] hover:tw-fill-[#EDEDF3] tw-duration-200"
                  >
                    <circle cx="11.5" cy="5.12" r="1.5" />
                    <circle cx="11.5" cy="12.12" r="1.5" />
                    <circle cx="11.5" cy="19.12" r="1.5" />
                  </svg>
                </div>
              </Dropdown>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
