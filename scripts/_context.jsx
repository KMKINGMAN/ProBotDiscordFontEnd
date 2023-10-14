import dynamic from 'next/dynamic'
import { useState, useEffect, createContext, useCallback, useRef } from 'react'
import moment from 'moment'
import 'moment/min/locales'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import socketIOClient from 'socket.io-client'
import isEqual from 'lodash/isEqual'
export const socket = socketIOClient(
  process.env.NEXT_PUBLIC_API_URL.endsWith('/api')
    ? undefined
    : process.env.NEXT_PUBLIC_API_URL,
  {
    transports: ['websocket'],
    autoConnect: false,
    path: '/ws'
  }
)

const AlertBox = dynamic(() => import('@component/AlertBox'), { ssr: false })

export const Context = createContext()
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

function Provider({ children, strings, router }) {
  const { locale } = useRouter()
  const [unsaved, setUnsaved] = useState(undefined)
  const [token, setToken] = useState(false)
  const [guilds, setGuilds] = useState([])
  const [guild, setGuildContext] = useState(false)
  const [online, setOnline] = useState(true)
  const [methods, setMethods] = useState([])
  const [sidebarRef, showSidebarRef, guildsRef, checkboxRef, guildTimeoutRef] =
    [useRef(), useRef(), useRef(), useRef(), useRef()]
  const [showSidebar, setShowSidebar] = useState(true)
  const [isLaptop, changeIsLaptop] = useState(false)

  const [state, setStates] = useState({
    name: 'My Name',
    language: 'en',
    logged: false,
    loading: true,
    user: false,
    sidebarPullRight: false,
    rtl: false,
    changeLanguage: (lang) => {
      strings.setLanguage(lang)

      moment.locale(lang)
      return setState({
        language: lang,
        rtl: ['fa', 'ar', 'ckb'].includes(lang) ? true : false
      })
    },
    login: (token) => {
      axios.defaults.headers.common.Authorization = token
      socket.send({ sid: token })
      setState({ logged: true, loading: true })

      return Promise.all([
        axios.get(`/user`).then((rq) => rq.data),
        axios.get(`/guilds`).then((rq) => rq.data)
      ])
        .then((v) => {
          setState({ user: v[0], logged: true, loading: false })
          setGuilds(
            v[1].map((g) => ({
              admin: (g.permissions & 0x8) === 0x8,
              ...g,
              icon: g.icon
                ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.jpg`
                : `https://ui-avatars.com/api/?background=494d54&uppercase=false&color=dbdcdd&size=128&font-size=0.33&name=${encodeURIComponent(
                    g.name
                  )}`
            }))
          )
          socket.connect()
          localStorage.setItem('ac', token)
          setToken(token)
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            localStorage.removeItem('ac')
            setToken(false)
            setState({ user: null, logged: false })
            router.push('/')
          }
        })
    },
    logout: (all) => {
      axios
        .get(`/logout`, {
          params: {
            ...(all ? { all: 1 } : {})
          }
        })
        .then((r) => {
          localStorage.removeItem('ac')
          setToken(false)
          setState({ user: null, logged: false })
          socket.disconnect()
          router.push('/')
        })
    },
    auth: (path = 'auth', guild_id) => {
      let w = 1000
      let h = 800
      // Fixes dual-screen position                         Most browsers      Firefox
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

      let scopes = ['identify', 'guilds', 'email']
      if (path === 'authback')
        scopes.push(
          'bot',
          'applications.commands',
          'applications.commands.permissions.update'
        )
      if (path === 'back')
        scopes = [
          'bot',
          'applications.commands',
          'applications.commands.permissions.update'
        ]
      let newWindow = window.open(
        `https://discord.com/oauth2/authorize?client_id=${
          process.env.NEXT_PUBLIC_BOT_ID
        }&scope=${scopes
          .filter((s) => s !== 'email' || path === 'auth')
          .join('+')}${guild_id ? '&guild_id=' + guild_id : ''}${
          guild_id ? '&disable_guild_select=true' : ''
        }${
          scopes.includes('bot') ? '&permissions=2080374975' : ''
        }&response_type=code&redirect_uri=${
          process.env.NEXT_PUBLIC_API_URL
        }/${path}`,
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

      // Puts focus on the
      if (window.focus) {
        newWindow.focus()
      }
    }
  })

  useEffect(() => {
    state.changeLanguage(locale)
  }, [locale])

  const setGuild = (obj, select) => {
    if (!obj && select) setGuildContext(false)
    if (!obj || !obj.id) return
    console.log(`[GUILD ${obj.id}] NEW DATA`, obj)
    let guildsClone = [...guilds]
    let index = guildsClone.findIndex((g) => g.id === obj.id)
    if (index === -1) return setGuildContext(false)
    guildsClone[index] = { ...guildsClone[index], ...obj }
    if (select || guild.id === obj.id) setGuildContext(guildsClone[index])
    if (!isEqual(guildsClone, guilds)) setGuilds(guildsClone)
  }

  useEffect(() => {
    // If unsaved is true and the user wants to close the google tap, show an alert box from the browser
    window.onbeforeunload = (event) => {
      event = event || window.event

      // For IE and Firefox prior to version 4
      if ((event, unsaved)) {
        event.returnValue = 'Sure?'
      }

      // For Safari
      if (unsaved) {
        return 'Sure?'
      }
    }
  }, [unsaved])

  const roleMapFun = (role) => ({
    ...role,
    color:
      role.color === 0
        ? `#99A9B5`
        : `#${role.color.toString(16).padStart(6, 0)}`
  })

  const onSocketGuildMessage = useCallback(
    (e) => {
      console.log(`[WEBSOCKET] [GUILD]`, e.id, guild.id, e, guild.error)
      clearTimeout(guildTimeoutRef.current)

      setGuild({
        id: e.id,
        ...(e.id === guild.id ? guild : {}),
        ...e,
        ...(Object.keys(e).length < 3 && e.commands
          ? { commands: { ...guild.commands, ...e.commands } }
          : {}),
        ...(Object.keys(e).length < 3 && e.modules
          ? { modules: { ...guild.modules, ...e.modules } }
          : {}),
        ...(e.roles ? { roles: e.roles?.map(roleMapFun) } : {}),
        ...{
          vip: e.botnumber
            ? e.botnumber && e.botnumber > 1
            : guild.botnumber > 1,
          loading: false,
          tier:
            (e.botnumber ?? guild.botnumber) === 2
              ? 1
              : (e.botnumber ?? guild.botnumber) > 2
              ? 2
              : undefined,
          settings: {
            language: e.language ?? guild.language,
            prefix: e.prefix || guild.prefix || '#'
          },
          roles: (e.roles ?? guild.roles)?.map?.(roleMapFun) || []
        }
      })
    },
    [guild, guilds]
  )

  const onSocketConnect = useCallback(() => {
    console.log('[WEBSOCKET] Connection success')
    if (guild)
      socket.emit('join', { guild: guild.id, authorization: localStorage.ac })
  }, [guild])

  useEffect(() => {
    socket.on('connect', onSocketConnect)
    socket.on('guild', onSocketGuildMessage)
    return () => {
      socket.removeListener('connect', onSocketConnect)
      socket.removeListener('guild', onSocketGuildMessage)
    }
  }, [onSocketGuildMessage])

  useEffect(() => {
    const myIntervinal = setInterval(() => {
      if (!document.hidden) {
        axios.get('/ping').catch(() => {
          window.location.reload()
        })
      }
    }, 1000 * 15)

    return () => {
      clearInterval(myIntervinal)
    }
  }, [])

  const [providerClass, setProviderClass] = useState('')

  const updateUser = () =>
    axios.get(`/user`).then((rq) => setState({ user: rq.data }))

  const Toast = Swal.mixin({
    toast: true,
    position: state.rtl ? 'top-start' : 'top-end',
    showConfirmButton: false,
    timer: 5000,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const selectServer = (id, update) => {
    // console.table(`[selecting server ${id}] All guilds:`,guilds)
    if (guild.id === id && !update) return
    if (!id) return setGuild(false, true)

    const guildFetch = guilds.find((g) => g && g.id === id)
    console.log('[SELECT GUILD]', id, guildFetch, guilds)
    if (!guildFetch) return false
    let g = { ...guildFetch }
    if (guildFetch.data && !update) return setGuild(g, true)
    setGuild({ ...g, loading: true }, true)
    console.log('JOINING CHANNEL SERVER ', id)
    socket.emit('join', { guild: id, authorization: localStorage.ac })
    guildTimeoutRef.current = setTimeout(() => {
      setGuildContext({ ...guildFetch, in: false, loading: false })
    }, 3000)
  }

  const setState = (object) => {
    setStates((prevState) => ({ ...prevState, ...object }))
  }

  const shake = () => {
    setProviderClass(
      'full-height full-width absolute animate__animated animate__shakeX animate__faster'
    )
    setTimeout(() => setProviderClass(''), 1000)
  }

  // change language before rendering -- SEO
  // if (!process.browser) {
  //   if (locale && strings.getLanguage() !== locale) strings.setLanguage(locale);
  // }

  const onMessage = useCallback(
    (event) => {
      if (typeof event.data !== 'string') return
      /*      if(event.data === "update_user_please") {
              GetUser(localStorage.setItem('ac'));
            }*/
      if (event.data === 'updatepremiums1778') {
        setState({ updatePremiums: true })
      }
      if (event.data.startsWith('InvitedBotToGuild_')) {
        let guildmatch = event.data.replace('InvitedBotToGuild_', '')
        if (guildmatch.match(/^[0-9]+$/) != null) {
          selectServer(guildmatch, true)
          router.push(`/server/${guildmatch}`)
        }
      }
      if (event.data.startsWith('Bearer')) {
        console.log('login attempt')
        state.login(event.data.split(' ')[1])
        if (router?.pathname === '/') router.push(`/dashboard`)
      }
    },
    [state, guilds, guild, token]
  )

  useEffect(() => {
    if (localStorage.getItem('ac')) {
      state.login(localStorage.getItem('ac'))
    } else {
      setState({ loading: false })
    }

    // set language by localStorage
    // if (localStorage.getItem("language"))
    //   state.changeLanguage(localStorage.getItem("language"));
    // set default language if not detected
    //alert(`${locale} ${localStorage.getItem("language")}`)
    //alert(router.asPath)

    console.log(
      "%cCareful, If someone told you to copy/paste something here you have an 11/10 chance you're being scammed.",
      'background: red; color: yellow; font-size: x-large'
    )
  }, [0])

  useEffect(() => {
    if (router.asPath.includes('[')) return
    if (
      locale === 'en' &&
      localStorage.getItem('language') &&
      locale !== localStorage.getItem('language')
    ) {
      state.changeLanguage(localStorage.getItem('language'))
      router.push(
        { pathname: router.pathname, query: router.query },
        router.asPath,
        { locale: localStorage.getItem('language') }
      )
    }
  }, [router.query])

  const onReload = () => {
    // if (!localStorage.getItem("ccac") && token)
    //   localStorage.setItem("ac", token);
  }

  useEffect(() => {
    window.addEventListener('message', onMessage)
    window.addEventListener('beforeunload', onReload)
    return () => window.removeEventListener('message', onMessage)
    window.removeEventListener('beforeunload', onReload)
  }, [onMessage])

  useEffect(() => {
    setInterval(() => {
      setOnline(navigator.onLine)
    }, 5000)
  }, [])

  useEffect(() => {
    if (!online) {
      Toast.fire({
        icon: 'error',
        title: "You're not connected to the internet"
      })
    }
  }, [online])

  useEffect(() => {
    if (!guilds.length) return
    if (router.query.guild_id !== guild.id) selectServer(router.query.guild_id)
  }, [router.query.guild_id, guilds])

  useEffect(() => {
    changeIsLaptop(Boolean(window.innerWidth <= 1024))
    window.addEventListener('resize', () => {
      changeIsLaptop(Boolean(window.innerWidth <= 1024))
    })
  }, [])

  const getLanguageFont = () => {
    // if (["ar", "fa", "ckb"].includes(state.language))
    //   return { fontFamily: `"Open Sans", "Vazirmatn", sans-serif` };
    return {}
  }

  const getSubscriptions = async () => {
    if (!guild.id) return

    try {
      const { data } = await axios.get(`/guilds/${guild.id}/subscriptions`)

      return data
    } catch (error) {
      console.log(error)

      Toast.fire({
        icon: 'error',
        title: 'Something went wrong'
      })
    }
  }

  return (
    <Context.Provider
      value={{
        ...state,
        guild,
        unsaved,
        setUnsaved,
        guilds,
        setGuild,
        shake,
        updateUser,
        setUser: (user) => setState({ user: { ...state.user, ...user } }),
        Toast,
        methods,
        setMethods,
        providerClass,
        selectServer,
        sidebarRef,
        showSidebarRef,
        guildsRef,
        checkboxRef,
        showSidebar,
        setShowSidebar,
        isLaptop,
        changeIsLaptop,
        getSubscriptions
      }}
    >
      <div
        id="main"
        className={`${state.rtl ? 'rtl' : ''} `}
        style={{ ...getLanguageFont() }}
      >
        {children}
      </div>
      {state?.user?.due && <AlertBox user={state.user} />}
    </Context.Provider>
  )
}

export default Provider
