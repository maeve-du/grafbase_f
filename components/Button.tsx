import Image from 'next/image'
import { MouseEventHandler } from 'react'

interface Props {
  title: string
  lefeIcon?: string | null
  rightIcon?: string | null
  handleClick?: MouseEventHandler
  isSubmitting?: boolean
  type?: 'button' | 'submit'
  bgColor?: string
  textColor?: string
}

const Button = ({ title, lefeIcon, rightIcon, handleClick, isSubmitting, type, bgColor, textColor }: Props) => {
  return (
    <button
      type={type || 'button'}
      disabled={isSubmitting}
      className={`flexCenter gap-2 px-6  py-3 ${textColor || 'text-white'}  ${
        isSubmitting ? 'bg-black/50' : bgColor ? bgColor : 'bg-primary-purple'
      } rounded-xl text-sm font-medium max-md:w-full`}
      onClick={handleClick}>
      {lefeIcon && <Image src={lefeIcon} width={14} height={14} alt='left' />}
      {title}
      {rightIcon && <Image src={rightIcon} width={14} height={14} alt='right' />}
    </button>
  )
}

export default Button
