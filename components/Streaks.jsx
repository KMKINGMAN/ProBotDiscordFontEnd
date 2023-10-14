import { Context } from '@script/_context'
import Tooltip from 'rc-tooltip'
import { useContext } from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'

export default function Streak({ streaks, id }) {
  const { user } = useContext(Context)

  return (
    <div className="bg-streak" id={id || ''}>
      <ScrollContainer className="streak-list">
        {streaks.map((streak, index) => (
          <Tooltip placement={'top'} overlay={streak.prize}>
            <div
              className={`streak${
                user.streak_count > index ? ' streak-taken' : ''
              } ${user.streak_count === index ? 'active' : ''} ${
                user.streak_count - 1 === index ? 'linear-gradient' : ''
              }`}
            >
              x{index + 1}
            </div>
          </Tooltip>
        ))}
      </ScrollContainer>
    </div>
  )
}
