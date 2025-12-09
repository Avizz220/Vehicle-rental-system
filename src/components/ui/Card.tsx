import { motion } from 'framer-motion'
import clsx from 'clsx'

export interface CardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
}

export const Card = ({
  children,
  className,
  hoverable = false,
  onClick,
}: CardProps) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4, scale: 1.02 } : {}}
      className={clsx(
        'bg-white rounded-xl shadow-md overflow-hidden transition-shadow duration-300',
        hoverable && 'hover:shadow-xl cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export const CardHeader = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={clsx('px-6 py-4 border-b', className)}>{children}</div>
}

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={clsx('px-6 py-4', className)}>{children}</div>
}

export const CardFooter = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={clsx('px-6 py-4 bg-gray-50 border-t', className)}>
      {children}
    </div>
  )
}
