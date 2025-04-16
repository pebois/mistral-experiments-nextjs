import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

interface Props {
  root: Element
  onInViewChange: (inView: boolean) => void
}

export const ChatAnchor: React.FC<Props> = ({ onInViewChange, root }) => {
  const { entry, inView, ref } = useInView({
    root,
  })
  useEffect(() => {
    onInViewChange(inView)
  }, [ entry, onInViewChange, inView ])
  return (
    <div
      ref={ref}
      className="h-0px w-full" />
  )
}