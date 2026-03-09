import type { FC } from 'react'

type FavBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isFav: boolean
}

/**
 * Add to Notebook
 */
export const FavBtn: FC<FavBtnProps> = props => {
  const { isFav, ...restProps } = props
  return (
    <button
      className="menuBar-Btn"
      // title={t('tip.addToNotebook')}
      {...restProps}
    >
      <svg
        className={`menuBar-Btn_Icon-fav${isFav ? ' isActive' : ''}`}
        width="30"
        height="30"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
      >
        <path d="M 23.363 2 C 20.105 2 17.3 4.65 16.001 7.42 C 14.701 4.65 11.896 2 8.637 2 C 4.145 2 0.5 5.646 0.5 10.138 C 0.5 19.278 9.719 21.673 16.001 30.708 C 21.939 21.729 31.5 18.986 31.5 10.138 C 31.5 5.646 27.855 2 23.363 2 Z" />
      </svg>
    </button>
  )
}
