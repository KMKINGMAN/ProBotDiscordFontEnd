import { useState } from 'react'
import styles from './style.module.css'
import { EMOJIS_THEME_COLOR_LIST } from './constants'
import Emoji from './Emoji'

export default function ColorsTheme({ themeColor, setThemeColor }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  const handleSwitchColors = (color_key) => {
    setThemeColor(color_key)

    setIsOpen(false)
  }

  const currentEmoji = EMOJIS_THEME_COLOR_LIST.find(
    (emoji) => emoji.id === themeColor
  )?.emoji

  return (
    <div className={styles['colors-themes']}>
      <button type="button" onClick={toggleOpen}>
        <Emoji
          emoji={{
            native: themeColor && themeColor !== 0 ? currentEmoji : '👏'
          }}
          size="24px"
        />
      </button>
      <ul
        className={`${styles['colors-themes__list']} ${
          isOpen ? styles['colors-themes__list-active'] : ''
        }`}
      >
        {EMOJIS_THEME_COLOR_LIST.filter((color) => color.id !== themeColor).map(
          (color) => (
            <li key={color.id} onClick={() => handleSwitchColors(color.id)}>
              <Emoji emoji={{ native: color.emoji }} size="24px" />
            </li>
          )
        )}
      </ul>
    </div>
  )
}
