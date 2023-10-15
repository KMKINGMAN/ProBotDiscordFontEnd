import { useContext, useEffect, useState } from 'react'
import ISelectChannelsProps, { ISelectedChannels } from './@types'
import Dropdown from 'rc-dropdown'
import { Context } from '@script/_context'
import { CATEGORY_ICON, CHANNEL_ICON } from './icons'
import strings from '@script/locale'

export default function SelectChannels(props: ISelectChannelsProps) {
  const { rtl, guild } = useContext(Context)
  const {
    handleChange,
    selectedValue,
    handleRemove,
    isMulti,
    isDisabled,
    errorMessage
  } = props

  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!showDropdown) setShowDropdown(true)
    setSearch(e.target.value)
  }
  const checkIfThereIsSelectedValue = isMulti
    ? Array.isArray(selectedValue) && selectedValue.length !== 0
    : selectedValue && (selectedValue as ISelectedChannels)?.value !== ''

  const guildChannels = guild.channels.filter(
    (channel) =>
      channel.name.toLowerCase().includes(search.toLowerCase()) ||
      channel.id.includes(search)
  )

  const getChannelsWithCategories = () => {
    let channels = guildChannels.filter(
      (channel: { type: number }) => channel.type === 0
    )

    let categories = guildChannels
      .filter((channel: { type: number }) => channel.type === 4)
      .sort(
        (a: { position: number }, b: { position: number }) =>
          a.position - b.position
      )

    let channelsWithCategories = categories.map((category) => {
      return {
        ...category,
        value: category.id,
        label: category.name,
        options: channels
          .filter(
            (channel: { parentID: string | undefined; type: number }) =>
              channel.parentID === category.id
          )
          .map((channel: { name: string; id: string | number | undefined }) => {
            return {
              label: channel.name,
              value: channel.id
            }
          })
      }
    })
    const newChannels = channels
      .filter(
        (channel: { parentID: string | undefined; type: number }) =>
          !channel.parentID
      )
      .map((channel: { name: string; id: string | number | undefined }) => {
        return {
          label: channel.name,
          value: channel.id
        }
      })

    return [...newChannels, ...channelsWithCategories]
  }

  const handleChangeValue = (
    value: ISelectedChannels | ISelectedChannels[]
  ) => {
    const oldValue = selectedValue as ISelectedChannels | ISelectedChannels[]
    if (
      isMulti &&
      Array.isArray(oldValue) &&
      oldValue.some((channel) =>
        (value as ISelectedChannels[])
          .map((c) => c.value)
          .includes(channel.value)
      )
    ) {
      const newValue = (oldValue as ISelectedChannels[]).filter((channel) =>
        (value as ISelectedChannels[]).every((c) => c.value !== channel.value)
      )
      handleChange(newValue)
      return
    } else if (
      !isMulti &&
      (oldValue as ISelectedChannels)?.value ===
        (value as ISelectedChannels[])[0].value
    ) {
      handleRemove(selectedValue as ISelectedChannels)
      return
    }

    if (isMulti) {
      const newValue = [
        ...(oldValue as ISelectedChannels[]),
        ...(value as ISelectedChannels[])
      ]
      handleChange(newValue)
    } else {
      handleChange(typeof value === 'object' ? value[0] : value)
    }

    setSearch('')
  }

  useEffect(() => {
    if (!showDropdown) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDropdown(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
  }, [showDropdown])

  const checkIfEmpty =
    getChannelsWithCategories().filter((channel) => {
      if (isMulti && Array.isArray(selectedValue)) {
        return (
          !selectedValue.some(
            (selectedChannel) => selectedChannel.value === channel.value
          ) && channel.label.toLowerCase().includes(search.toLowerCase())
        )
      } else {
        return (
          channel.label.toLowerCase().includes(search.toLowerCase()) &&
          (selectedValue as ISelectedChannels)?.value !== channel.value
        )
      }
    }).length === 0

  return (
    <Dropdown
      prefixCls={'dropdown'}
      trigger={'click'}
      visible={isDisabled ? false : showDropdown}
      onVisibleChange={(visible) => setShowDropdown(visible)}
      overlayStyle={{
        zIndex: 1
      }}
      overlay={
        <ul className="tw-min-w-96 tw-max-h-96 tw-overflow-y-auto tw-rounded-md tw-border tw-border-solid tw-border-grey-1 tw-bg-grey-4 tw-p-2 tw-text-white tw-shadow-lg">
          {checkIfEmpty ? (
            <div className="tw-flex tw-justify-center tw-p-3">
              <p className="tw-m-0">{strings.no_option}</p>
            </div>
          ) : (
            getChannelsWithCategories()
              .filter((channel) => {
                if (isMulti && Array.isArray(selectedValue)) {
                  return (
                    !selectedValue.some(
                      (selectedChannel) =>
                        selectedChannel.value === channel.value
                    ) &&
                    channel.label.toLowerCase().includes(search.toLowerCase())
                  )
                } else {
                  return (
                    channel.label
                      .toLowerCase()
                      .includes(search.toLowerCase()) &&
                    (selectedValue as ISelectedChannels)?.value !==
                      channel.value
                  )
                }
              })
              .map((channel) => {
                return (
                  <li
                    key={channel.label}
                    onClick={() => {
                      if (!channel.options) {
                        handleChangeValue([channel] as ISelectedChannels[])
                        setShowDropdown(false)

                        return
                      }
                      handleChangeValue([channel] as ISelectedChannels[])
                      setShowDropdown(false)
                    }}
                    className={`tw-cursor-pointer tw-rounded-md tw-p-2 hover:tw-bg-grey-3`}
                  >
                    {channel.options ? CATEGORY_ICON : CHANNEL_ICON}
                    <span>{channel.label}</span>
                    {channel.options && channel.options.length > 0 && (
                      <ul className="tw-mt-2 tw-pl-2">
                        {channel.options
                          .filter((channel) => {
                            if (isMulti && Array.isArray(selectedValue)) {
                              return (
                                !selectedValue.some(
                                  (selectedChannel) =>
                                    selectedChannel.value === channel.value
                                ) &&
                                channel.label
                                  .toLowerCase()
                                  .includes(search.toLowerCase())
                              )
                            } else {
                              return (
                                channel.label
                                  .toLowerCase()
                                  .includes(search.toLowerCase()) &&
                                (selectedValue as ISelectedChannels)?.value !==
                                  channel.value
                              )
                            }
                          })
                          .map((option: { label: string; value: string }) => {
                            return (
                              <li
                                key={option.label}
                                onClick={(event) => {
                                  event.stopPropagation()
                                  handleChangeValue([
                                    option
                                  ] as ISelectedChannels[])
                                }}
                                className="tw-flex tw-cursor-pointer tw-items-center tw-rounded-md tw-p-2 hover:tw-bg-grey-2"
                              >
                                {CHANNEL_ICON}

                                <span>{option.label}</span>
                              </li>
                            )
                          })}
                      </ul>
                    )}
                  </li>
                )
              })
          )}
        </ul>
      }
    >
      <div>
        {checkIfThereIsSelectedValue ? (
          <div
            className={`tw-border-1 tw-flex tw-w-full tw-cursor-pointer tw-items-center tw-rounded-md tw-border tw-border-solid tw-border-grey-1 tw-bg-[#25252c] tw-p-2 tw-px-3 tw-text-start tw-text-white`}
          >
            {selectedValue && (
              <ul className="tw-m-0 tw-flex tw-w-full tw-flex-wrap tw-gap-1">
                {isMulti ? (
                  Array.isArray(selectedValue) &&
                  selectedValue.map((value: any) => {
                    return (
                      <li
                        className="tw-flex tw-cursor-pointer tw-items-center tw-gap-1 tw-rounded-sm tw-bg-grey-2 tw-px-1 tw-py-[2px] tw-text-sm tw-text-white"
                        onClick={(event) => {
                          event.stopPropagation()
                          handleRemove(value)
                        }}
                      >
                        {value.type === 4 ? (
                          <div>
                            {CATEGORY_ICON}
                            <span>{value.name}</span>
                          </div>
                        ) : (
                          <div>
                            {CHANNEL_ICON}
                            <span>{value.name}</span>
                          </div>
                        )}
                        <button
                          onClick={(event) => {
                            event.stopPropagation()
                            handleRemove(value)
                          }}
                          className="tw-hover:text-red-main tw-flex tw-h-4 tw-w-4 tw-cursor-pointer tw-items-center tw-justify-center tw-rounded-full tw-border-none tw-bg-grey-1 tw-text-[10px] tw-font-bold tw-leading-none tw-text-grey-text3 tw-outline-none"
                        >
                          X
                        </button>
                      </li>
                    )
                  })
                ) : (
                  <li
                    className="tw-flex tw-cursor-pointer tw-items-center tw-gap-1 tw-rounded-sm tw-bg-grey-2 tw-px-1 tw-py-[2px] tw-text-sm tw-text-white"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleRemove(selectedValue as ISelectedChannels)
                    }}
                  >
                    {(selectedValue as any).type === 4 ? (
                      <div>
                        {CATEGORY_ICON}
                        <span>{(selectedValue as any).name}</span>
                      </div>
                    ) : (
                      <div>
                        {CHANNEL_ICON}
                        <span>{(selectedValue as any).name}</span>
                      </div>
                    )}
                    <button
                      onClick={(event) => {
                        event.stopPropagation()
                        handleRemove(selectedValue as ISelectedChannels)
                      }}
                      className="tw-hover:text-red-main tw-flex tw-h-4 tw-w-4 tw-cursor-pointer tw-items-center tw-justify-center tw-rounded-full tw-border-none tw-bg-grey-1 tw-text-[10px] tw-font-bold tw-leading-none tw-text-grey-text3 tw-outline-none"
                    >
                      X
                    </button>
                  </li>
                )}
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  className="tw-w-[100px] tw-cursor-pointer tw-border-none tw-bg-transparent tw-text-start tw-text-white tw-placeholder-white tw-placeholder-opacity-50 tw-outline-none"
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace' && search === '') {
                      if (Array.isArray(selectedValue)) {
                        handleRemove(selectedValue[selectedValue.length - 1])
                      } else {
                        handleRemove(selectedValue)
                      }
                    }
                  }}
                  disabled={isDisabled}
                />
              </ul>
            )}
            <i
              className={`fas fa-chevron-${
                showDropdown ? 'up' : 'down'
              } tw-mx-1 tw-text-[12px] tw-text-white`}
            ></i>
          </div>
        ) : (
          <div
            className={`tw-flex tw-w-full tw-cursor-pointer tw-items-center tw-rounded-[8px] tw-border-[1px] tw-border-solid tw-border-grey-1 tw-bg-[#25252c] tw-text-white tw-text-start${
              isDisabled ? ' tw-opacity-50' : ''
            }`}
          >
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder={strings.select_placeholder_select}
              className={`tw-min-h-[42px] tw-w-full tw-cursor-pointer tw-rounded-[8px] tw-border-none tw-bg-transparent tw-px-[12px] tw-py-[2px] tw-text-white tw-placeholder-white tw-outline-none ${
                rtl ? 'tw-text-right' : 'tw-text-left'
              }`}
              disabled={isDisabled}
            />
            <i
              className={`fas fa-chevron-${
                showDropdown ? 'up' : 'down'
              } tw-mx-3 tw-text-[12px] tw-text-white`}
            ></i>
          </div>
        )}
        {errorMessage && (
          <p className="tw-mt-1 tw-text-xs tw-text-red-main">{errorMessage}</p>
        )}
      </div>
    </Dropdown>
  )
}
