import { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import BgItem from '@component/store_bg_item'
import strings from '@script/locale'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Context } from '@script/_context'
import { useRouter } from 'next/router'

export async function getServerSideProps(context) {
  if (!['profile', 'rank'].includes(context.params.store)) {
    return { notFound: true }
  }
  return {
    props: {}
  }
}

function StoreBackgrounds() {
  const { user } = useContext(Context)
  const router = useRouter()
  const [state, setStates] = useState({
    backgrounds: [],
    sort: 'newest',
    category: 'all',
    owned: false,
    loading: false
  })

  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }))

  useEffect(() => {
    if (!user) return
    setState({ loading: true })
    axios
      .get('bg', {
        params: { store: router.query.store === 'profile' ? 'profile' : 'id' }
      })
      .then((response) => {
        setState({ backgrounds: response.data, loading: false })
      })
  }, [router.query])

  const sort = (a, b) => {
    if (state.sort === 'newest') return a.n < b.n ? 1 : b.n < a.n ? -1 : 0
    if (state.sort === 'low_price')
      return a.price > b.price ? 1 : b.price > a.price ? -1 : 0
    if (state.sort === 'high_price')
      return a.price < b.price ? 1 : b.price < a.price ? -1 : 0
  }
  const filter = (element) => {
	console.log(state);
    if (state.category === 'all') return true
    return state.category === element.category
  }
  const bgs = state.backgrounds.filter((element) => {
    if (
      !element.filename ||
      element.filename.endsWith('txt') ||
      element.filename.endsWith('bat')
    )
      return false
    else if (
      state.owned &&
      !user?.ownedbgs.split(',').includes(String(element.id))
    )
      return false
    return true
  })
  return (
    <div className="dramex-component-69">
      <div className="tab-struct custom-tab-1 mt-40 pb-25">
        <ul role="tablist" className="nav nav-pills gap-2" id="myTabs_7">
          <li
            className={`nav-item mb-3 ${
              state.category === 'all' ? 'active' : ''
            }`}
          >
            <a
              className="p-2 rounded"
              onClick={() => {
                setState({ category: 'all' })
              }}
            >{`${strings.store_all} (${bgs.length})`}</a>
          </li>
          <li
            className={`nav-item mb-3 ${
              state.category === 'Games' ? 'active' : ''
            }`}
          >
            <a
              className="p-2 rounded"
              onClick={() => {
                setState({ category: 'Games' })
              }}
            >{`${strings.store_games} (${
              bgs.filter((bg) => bg.category === 'Games').length
            })`}</a>
          </li>
          <li
            className={`nav-item mb-3 ${
              state.category === 'Anime' ? 'active' : ''
            }`}
          >
            <a
              className="p-2 rounded"
              onClick={() => {
                setState({ category: 'Anime' })
              }}
            >{`${strings.store_anime} (${
              bgs.filter((bg) => bg.category === 'Anime').length
            })`}</a>
          </li>
          <li
            className={`nav-item mb-3 ${
              state.category === 'TV' ? 'active' : ''
            }`}
          >
            <a
              className="p-2 rounded"
              onClick={() => {
                setState({ category: 'TV' })
              }}
            >{`${strings.store_tv_cienma} (${
              bgs.filter((bg) => bg.category === 'TV').length
            })`}</a>
          </li>
          <li
            className={`nav-item mb-3 ${
              state.category === 'Nature' ? 'active' : ''
            }`}
          >
            <a
              className="p-2 rounded"
              onClick={() => {
                setState({ category: 'Nature' })
              }}
            >{`${strings.store_nature} (${
              bgs.filter((bg) => bg.category === 'Nature').length
            })`}</a>
          </li>
          <li
            className={`nav-item mb-3 ${
              state.category === 'other' ? 'active' : ''
            }`}
          >
            <a
              className="p-2 rounded"
              onClick={() => {
                setState({ category: 'other' })
              }}
            >{`${strings.OTHERS} (${
              bgs.filter((bg) => bg.category === 'other').length
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
              id="checkbox2"
              className="form-check-input"
              type="checkbox"
              checked={state.owned}
              onChange={() => setState({ owned: !state.owned })}
            />
            <label className="form-check-label ps-2" htmlFor="checkbox2">
              {strings.store_owned}
            </label>
          </div>
        </div>
      </div>
      <hr />
      {state.loading ? (
        <div className="bglist bglist-skeleton-loading">
          {Array.from(Array(50).keys()).map((index) => (
            <SkeletonTheme color="#393943" highlightColor="#1f1f25" key={index}>
              <div className="store-bg-skeleton-loading">
                <Skeleton className="amount-loading" />
                <Skeleton className="store-bg-skeleton-loading-as" />
              </div>
            </SkeletonTheme>
          ))}
        </div>
      ) : (
        <div className="bglist">
          {bgs
            .filter(filter)
			.filter(bg => !bg.hidden)
            .sort(sort)
            .map((bg, index) => (
              <BgItem
                key={index}
                store={router.query.store === 'profile' ? 'profile' : 'id'}
                data={bg}
                owned={user?.ownedbgs.split(',').includes(String(bg.id))}
                current={
                  (router.query.store === 'profile'
                    ? user.current_bg
                    : user.current_id_bg) === bg.filename
                }
              />
            ))}
        </div>
      )}
    </div>
  )
}
export default StoreBackgrounds
