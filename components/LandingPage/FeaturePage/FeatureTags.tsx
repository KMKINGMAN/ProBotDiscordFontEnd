type FeatureTagData = {
  content: string[]
  color: string
}

export default function FeatureTags({ data }: { data: FeatureTagData }) {
  return (
    <section className="tw-flex tw-flex-wrap tw-justify-between lg:tw-justify-center lg:tw-gap-12 sm:tw-gap-6">
      {data.content.map((tag, index) => (
        <div
          data-aos="fade-up"
          data-aos-offset="0"
          data-aos-duration={(500 + index * 150).toString()}
          style={{
            backgroundImage: `linear-gradient(90deg, ${data.color}66 -334.79%, ${data.color}00 50%)`,
            borderLeft: `2px solid ${data.color}`
          }}
          dangerouslySetInnerHTML={{ __html: tag }}
          className={`feature_tag_span landing-headline-sec tw-w-full tw-max-w-xs tw-px-8 tw-py-4 tw-text-xl tw-text-gray-300 sm:tw-text-[18px]`}
        ></div>
      ))}
    </section>
  )
}
