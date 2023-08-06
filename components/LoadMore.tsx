'use client'
import Button from './Button'
import { useRouter } from 'next/navigation'

interface Props {
  startCursor: string
  endCursor: string
  hasPreviousPage: boolean
  hasNextPage: boolean
}

const LoadMore = ({ startCursor, endCursor, hasPreviousPage, hasNextPage }: Props) => {
  const router = useRouter()
  const handleNavigation = (dirction: string) => {
    const currentParams = new URLSearchParams(window.location.search)
    if (dirction === 'next' && hasNextPage) {
      currentParams.delete('startCursor')
      currentParams.set('endCursor', endCursor)
    } else if (dirction === 'first' && hasPreviousPage) {
      currentParams.delete('endCursor')
      currentParams.set('startCursor', startCursor)
    }
    const newSearchParams = currentParams.toString()
    const newPathName = `${window.location.pathname}?${newSearchParams}`

    router.push(newPathName)
  }
  return (
    <div className="w-full flexCenter gap-5 mt-10">
      {hasPreviousPage && (
        <Button
          title="First Page"
          handleClick={() => {
            handleNavigation('first')
          }}
        />
      )}
      {hasNextPage && (
        <Button
          title="Next"
          handleClick={() => {
            handleNavigation('next')
          }}
        />
      )}
    </div>
  )
}

export default LoadMore
