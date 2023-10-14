import strings from "@script/locale";
import Head from "next/head";
import ReactMarkdown from 'react-markdown'
import {
  Navbar,
  Footer
} from '../components/LandingPage'
import { Manrope } from 'next/font/google'

  const manrope = Manrope({
    subsets: ['latin']
  })

export default function PrivacyPolicy() {
  
  const sectionStyle = 'tw-max-w-[1240px] tw-m-auto tw-px-3 lg:tw-px-8'

  return (
    <div
      className={`${manrope.className} landing-text tw-h-fit tw-w-full tw-bg-gray-900`}
    >
      <Head>
        <title>
          {strings.rp_title} - {strings.probot}
        </title>
      </Head>
      <Navbar />
      <div className={`${sectionStyle} tw-mt-20 tw-h-full`}>
        <div className="landing-para tw-rounded-lg tw-bg-gray-850 tw-p-8">
          <ReactMarkdown
            className="legal-markdown"
            children={strings.rp_content}
          />
        </div>
      </div>
      <div className={`${sectionStyle} tw-h-full`}>
        <Footer />
      </div>
    </div>
  )
}
