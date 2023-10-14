import { useState, useContext, useEffect } from 'react'
import Select from 'react-select'
import { Context } from '@script/_context'
import strings from '@script/locale'
import moment from 'moment'

const STYLES = {
  groupStyles: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  groupBadgeStyles: {
    backgroundColor: '#EBECF0',
    borderRadius: '2em',
    color: '#172B4D',
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: '1',
    minWidth: 1,
    padding: '0.16666666666667em 0.5em',
    textAlign: 'center'
  },
  formatOption: {
    root: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    img: {
      userSelect: 'none',
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      objectFit: 'cover'
    },
    info: {
      display: 'flex',
      flexDirection: 'column'
    },
    userInfo: {
      root: {
        display: 'flex',
        alignItems: 'center',
        gap: '2px'
      },
      img: {
        userSelect: 'none',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        objectFit: 'cover'
      },
      name: {
        fontSize: '11px'
      }
    }
  }
}

export default function SubscriptionsDropdown() {
  const [subscriptions, setSubscriptions] = useState({
    premium: [],
    prime: [],
    users: []
  })
  const [selectedBot, setSelectedBot] = useState(null)
  const [haveSubscriptions, setHaveSubscriptions] = useState(false)
  const [loading, setLoading] = useState(false)
  const { auth, guild, getSubscriptions } = useContext(Context)

  useEffect(() => {
    setLoading(true)
    const getSubs = async () => {
      const data = await getSubscriptions()
      setSubscriptions(data)
      setLoading(false)
    }
    getSubs()
  }, [])

  useEffect(() => {
    if (subscriptions.premium.length > 0 || subscriptions.prime.length > 0) {
      setHaveSubscriptions('have subscriptions')
    } else {
      setHaveSubscriptions("don't have subscriptions")
    }
  }, [subscriptions])

  const formatGroupLabel = (data) => (
    <div style={STYLES.groupStyles}>
      <span>{data.label}</span>
      <span style={STYLES.groupBadgeStyles}>{data.options.length}</span>
    </div>
  )

  const formatOptionLabel = ({ label, avatar, user, end, name }) => {
    return (
      <div style={STYLES.formatOption.root}>
        {avatar && (
          <img src={avatar} alt={label} style={STYLES.formatOption.img} />
        )}
        <div style={STYLES.formatOption.info}>
          <span>
            {`${name ? `${name} |` : ''} ${
              subscriptions.autorenew ? strings.renews : strings.ends
            } ${moment(end).startOf('hour').fromNow()}`}
          </span>
          {user && (
            <div style={STYLES.formatOption.userInfo.root}>
              <img
                src={user.avatar}
                alt={user.name}
                style={STYLES.formatOption.userInfo.img}
              />
              <span
                style={STYLES.formatOption.userInfo.name}
              >{`${user.name}#${user.discriminator}`}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleChange = (value) => setSelectedBot(value)

  const selectedValue = [...subscriptions.premium, ...subscriptions.prime].find(
    ({ id }) => id === selectedBot?.value
  )

  const invite = (id, tier) => {
    let w = 500
    let h = 750
    let dualScreenLeft =
      window.screenLeft !== undefined ? window.screenLeft : window.screenX
    let dualScreenTop =
      window.screenTop !== undefined ? window.screenTop : window.screenY

    let width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : window.screen.width
    let height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : window.screen.height

    let left = width / 2 - w / 2 + dualScreenLeft
    let top = height / 2 - h / 2 + dualScreenTop
    let newWindow = window.open(
      tier === 1
        ? `https://discord.com/oauth2/authorize?client_id=567703512763334685&scope=bot+applications.commands+applications.commands.permissions.update&guild_id=${guild.id}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_API_URL}/invite/prime&permissions=2080374975&state=${id}`
        : `https://discord.com/oauth2/authorize?client_id=${id}&scope=bot+applications.commands+applications.commands.permissions.update&guild_id=${guild.id}&permissions=2080374975`,
      '_blank',
      'scrollbars=yes, width=' +
        w +
        ', height=' +
        h +
        ', top=' +
        top +
        ', left=' +
        left
    )

    // Puts focus on the newWindow
    if (window.focus) {
      newWindow.focus()
    }
  }

  return (
    <>
      <h2>{strings.REQUIRES_SETUP}</h2>
      {haveSubscriptions === 'have subscriptions' && (
        <div className="full-width">
          <label className="control-label">{strings.bot_require_invite}</label>
          <Select
            classNamePrefix="formselect"
            placeholder={strings.select_placeholder_select}
            options={[
              {
                label: `${strings.premium} ${strings.tier} 2`,
                options: subscriptions.premium.map((subscription) => ({
                  tier: 2,
                  name: subscription.name,
                  label: subscription.name,
                  end: subscription.end,
                  value: subscription.id,
                  avatar:
                    subscription.avatar ||
                    'https://cdn.discordapp.com/avatars/567703512763334685/cc510fc4f2ebd6c15fc7fb3b5411bde7.webp',
                  user: subscriptions.users.find(
                    (user) => user.id === subscription.user
                  )
                }))
              },
              {
                label: `${strings.premium} ${strings.tier} 1`,
                options: subscriptions.prime.map((subscription) => ({
                  tier: 1,
                  label: `${
                    subscriptions.autorenew ? strings.renews : strings.ends
                  } ${moment(subscriptions.end).startOf('hour').fromNow()}`,
                  value: subscription.id,
                  end: subscription.end,
                  avatar:
                    'https://cdn.discordapp.com/avatars/567703512763334685/cc510fc4f2ebd6c15fc7fb3b5411bde7.webp',
                  user: subscriptions.users.find(
                    (user) => user.id === subscription.user
                  )
                }))
              }
            ]}
            formatGroupLabel={formatGroupLabel}
            formatOptionLabel={formatOptionLabel}
            onChange={handleChange}
            value={
              selectedValue
                ? {
                    value: selectedValue.id,
                    label: selectedValue.id,
                    end: selectedValue.end,
                    name: selectedValue.name,
                    avatar:
                      selectedValue.avatar ||
                      'https://cdn.discordapp.com/avatars/567703512763334685/cc510fc4f2ebd6c15fc7fb3b5411bde7.webp'
                  }
                : null
            }
          />
        </div>
      )}

      <div>
        {subscriptions && (
          <a
            className="btn btn-primary btn-icon btn-rounded btn-lg inviteBtn"
            onClick={
              subscriptions.premium.length > 0 || subscriptions.prime.length > 0
                ? () => invite(selectedBot.value, selectedBot.tier)
                : () => auth('back', guild.id)
            }
          >
            {loading ? (
              <i className="fas fa-circle-notch fa-spin" />
            ) : (
              <i className="fab fa-discord btn-discord-logo" />
            )}

            {strings.CONTINUE_TO_DISCORD}
          </a>
        )}
      </div>
    </>
  )
}
