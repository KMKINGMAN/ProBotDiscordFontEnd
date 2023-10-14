import { ROnboardingStep, ROnboardingWrapper } from 'r-onboarding'
import strings from '@script/locale'

export default function DailyOnboardingWrapper({ steps, wrapperRef }) {
  return (
    <ROnboardingWrapper
      ref={wrapperRef}
      steps={steps}
      options={{
        scrollToStep: {
          enabled: true,
          options: {
            behavior: 'smooth'
          }
        },
        overlay: {
          enabled: true,
          padding: 12,
          borderRadius: 8,
          color: 'rgba(0, 0, 0, 0.5)',
          border: "1px solid #fff"
        },
        popper: {
          enabled: true,
          strategy: 'absolute',
        }
      }}
    >
      {({ step, exit }) => {
        if (!step) return null

        return (
          <ROnboardingStep>
            <div className="onboarding-container">
              <img src="/images/daily-onboarding.svg" alt="daily-onboarding" />
              <div className="content">
                <div className="content-text">
                  <h3>{step.content.title}</h3>
                  <p>{step.content.description}</p>
                </div>
                <button
                  onClick={() => {
                    exit()
                  }}
                >
                  {strings.got_it || 'Got it'}
                </button>
              </div>
            </div>
          </ROnboardingStep>
        )
      }}
    </ROnboardingWrapper>
  )
}
