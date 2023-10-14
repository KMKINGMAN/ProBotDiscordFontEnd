import { useEffect } from 'react'
import { Button } from '../Button'
import Feature from '../Feature'
import AOS from 'aos'
import 'aos/dist/aos.css'

type Feature = {
  id: number
  title: string
  desc: string
  btn: string
  img: string
  reversed: boolean
  link: string
  icon: string
}

export default function Features({ features }: { features: Feature[] }) {
  useEffect(() => {
    AOS.init()
  }, [])

  return (
    <section className="tw-flex tw-flex-col tw-items-center tw-gap-56 sm:tw-gap-20">
      {features.map((feature, index) => (
        <Feature key={feature.id} feature={feature} />
      ))}
    </section>
  )
}
