import * as React from 'react'

// import { LazyLoadImage } from 'react-lazy-load-image-component'
import cn from 'classnames'
import './avatar.scss'

const colors = ['#44d7b6', '#32c5ff', '#ff819b', '#ffbe80', '#908eff']
function getColorByName (name = 'N') {
  return colors[(name[0] || '').charCodeAt(0) % colors.length]
}

export const Avatar = React.memo(function Avatar ({
  className,
  contentClassName,
  src,
  style,
  borderRadius = '4px',
  alt,
  children,
  size = 30,
  ...rest
}) {
  const imgComp = '' /* React.useMemo(
    () => (
      <LazyLoadImage
        alt={alt}
        wrapperClassName={contentClassName}
        src={src} // use normal <img> attributes as props
      />
    ),
    [src, contentClassName, alt],
  ) */

  const processChildren = React.useMemo(() => {
    if (children) {
      if (React.isValidElement(children)) {
        return children
      }
      return children.trim().substring(0, 2)
    }
    return null
  }, [children])

  return (
    <div
      className={cn('app--avatar', className)}
      style={{
        backgroundColor: getColorByName(children),
        width: `${size}px`,
        height: `${size}px`,
        borderRadius,
        ...style,
      }}
      {...rest}
    >
      {src ? (
        imgComp
      ) : (
        <div className={cn('app--avatar-content', contentClassName)}>
          {processChildren}
        </div>
      )}
    </div>
  )
})
