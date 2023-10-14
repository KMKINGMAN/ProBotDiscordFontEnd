/* eslint-disable indent */
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import BgItem from '@component/store_badges_item'
import debounce from 'lodash/debounce'
import strings from '@script/locale'
import { Context } from '@script/_context'
import Head from 'next/head'

export default function StoreBadges() {
  const { user, updateUser, Toast } = useContext(Context)
  const [state, setStates] = useState({
    current_badge: '',
    selected: undefined,
    badges: [],
    sort: 'newest',
    category: 'all',
    owned: false
  })
  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }))

  useEffect(() => {
    if (!user || state.badges.length) return
    axios.get('badges').then((response) => setState({ badges: response.data }))
  }, [user])

  const sort = (a, b) => {
    if (state.sort === 'newest') return a.n < b.n ? 1 : b.n < a.n ? -1 : 0
    if (state.sort === 'low_price')
      return a.price > b.price ? 1 : b.price > a.price ? -1 : 0
    if (state.sort === 'high_price')
      return a.price < b.price ? 1 : b.price < a.price ? -1 : 0
  }

  function filter(element) {
    if (state.category === 'all') return true
    return state.category === element.category
  }

  const deleteBadge = debounce(() => {
    axios
      .post('buyanduse', {
        type: 'delete_badge',
        Selected: state.selected + 1
      })
      .then((response) => {
        if (response.data.status === 'done') {
          Toast.fire({
            icon: 'success',
            title: strings.store_badge_been_deleted
          })
          setState({ selected: null })
        }
        updateUser()
      })
      .catch(() => {
        Toast.fire({
          icon: 'error',
          title: strings.store_error_contact_support
        })
      })
  }, 300)
  if (!user) return <div>loading</div>
  let current_badge = []
  if (user?.current_badge) current_badge = user?.current_badge.split(',')

  const badges = state.badges.filter((element) => {
    if (
      state.owned &&
      !user?.ownedbadges.split(',').includes(String(element.n))
    )
      return false
    return true
  })
  return (
    <div className="pt-25">
      <Head>
        <title>
          {strings.BADGES} - {strings.probot}
        </title>
      </Head>
      <center>
        {strings.store_select_abadge}
        <div className="pt-20 ltr">
          {current_badge.map((filename, index) => (
            <div
              key={index}
              className="sbadge-item"
              onClick={() => setState({ selected: index })}
            >
              {state.selected === index && (
                <div id="p_143" className="sbadge-delete" onClick={deleteBadge}>
                  <i className="fas fa-times" />
                </div>
              )}
              <img
                key={index}
                className={` ${state.selected !== index && 'sbadge'}`}
                src={`https://probot.media/badges/${filename}`}
                width={80}
              />
            </div>
          ))}
          {current_badge.length < 5 && (
            <div
              className="sbadge-item"
              onClick={() => setState({ selected: current_badge.length })}
            >
              <img
                src={
                  'https://ui-avatars.com/api/?size=80&background=7289da&color=fff&name=' +
                  (current_badge.length + 1)
                }
                key={Number(current_badge.length + 1)}
                className={`border-radius-half ${
                  state.selected !== current_badge.length && 'sbadge'
                }`}
              />
            </div>
          )}
        </div>
      </center>
      {state.selected !== undefined && (
        <div>
          <div className="tab-struct custom-tab-1 mt-40 pb-25">
            <ul role="tablist" className="nav nav-pills gap-2" id="myTabs_7">
              <li
                className={`nav-item mb-3 ${
                  state.category === 'all' ? 'active' : ''
                }`}
              >
                <a
                  href="#"
                  className="p-2 rounded"
                  onClick={() => {
                    setState({ category: 'all' })
                  }}
                >{`${strings.store_all} (${badges.length})`}</a>
              </li>
              <li
                className={`nav-item mb-3 ${
                  state.category === 'games' ? 'active' : ''
                }`}
              >
                <a
                  href="#"
                  className="p-2 rounded"
                  onClick={() => {
                    setState({ category: 'games' })
                  }}
                >{`${strings.store_games} (${
                  badges.filter((bg) => bg.category === 'games').length
                })`}</a>
              </li>
              <li
                className={`nav-item mb-3 ${
                  state.category === 'clubs' ? 'active' : ''
                }`}
              >
                <a
                  href="#"
                  className="p-2 rounded"
                  onClick={() => {
                    setState({ category: 'clubs' })
                  }}
                >{`${strings.store_football} (${
                  badges.filter((bg) => bg.category === 'clubs').length
                })`}</a>
              </li>
              <li
                className={`nav-item mb-3 ${
                  state.category === 'footballers' ? 'active' : ''
                }`}
              >
                <a
                  href="#"
                  className="p-2 rounded"
                  onClick={() => {
                    setState({ category: 'footballers' })
                  }}
                >{`${strings.store_footballers} (${
                  badges.filter((bg) => bg.category === 'footballers').length
                })`}</a>
              </li>
              <li
                className={`nav-item mb-3 ${
                  state.category === 'animals' ? 'active' : ''
                }`}
              >
                <a
                  href="#"
                  className="p-2 rounded"
                  onClick={() => {
                    setState({ category: 'animals' })
                  }}
                >{`${strings.store_animals} (${
                  badges.filter((bg) => bg.category === 'animals').length
                })`}</a>
              </li>
              <li
                className={`nav-item mb-3 ${
                  state.category === 'others' ? 'active' : ''
                }`}
              >
                <a
                  href="#"
                  className="p-2 rounded"
                  onClick={() => {
                    setState({ category: 'others' })
                  }}
                >{`${strings.OTHERS} (${
                  badges.filter((bg) => bg.category === 'others').length
                })`}</a>
              </li>
            </ul>
            <div className="d-flex justify-content-center gap-3">
              <select
                className="form-control form-select w-auto"
                value={state.sort}
                onChange={(event) => {
                  setState({ sort: event.target.value })
                }}
              >
                <option value="newest">{strings.store_newest}</option>
                <option value="low_price">{strings.store_low_price}</option>
                <option value="high_price">{strings.store_high_price}</option>
              </select>
              <div className="form-check align-self-center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="owned-badges-checkbox"
                  checked={state.owned}
                  onChange={() => setState({ owned: !state.owned })}
                />
                <label
                  className="form-check-label ps-2"
                  htmlFor="owned-badges-checkbox"
                >
                  {strings.store_owned}
                </label>
              </div>
            </div>
          </div>
          <hr />
          <div className="bglist badges">
            {badges
              .filter(filter)
              .filter(bg => !bg.hidden)
              .sort(sort)
              .map((bg, index) => (
                <BgItem
                  key={index}
                  data={bg}
                  owned={user?.ownedbadges.split(',').includes(String(bg.n))}
                  selected={state.selected}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
