import { useContext } from 'react'
import { Context } from '@script/_context'
import strings from '@script/locale'
import Head from 'next/head'

export default function Login() {
  const { auth } = useContext(Context)

  return (
    <div>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="central-body tw-bold tw-bg-grey-4">
        <h1 className="tw-font-bold">Oops! It looks like something's missing </h1>
        <p className="tw-text-grey-text2 tw-font-sm tw-text-sm tw-font-normal">
          You need to login with your Discord account to access this feature.
        </p>
        <a
          href="#"
          className="hover:tw-bg-grey-3 hover:tw- tw-duration-200 tw-transition-all tw-p-3 tw-pl-5 tw-pr-5 tw-mt-5 tw-flex tw-gap-3 btn-discord-logo"
          onClick={() => auth('auth')}
        >
          <i className="fab fa-discord"></i>
          {strings.login_using_discord}
        </a>
      </div>
    </div>
  )
}
