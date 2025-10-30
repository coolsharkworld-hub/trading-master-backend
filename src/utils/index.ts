import moment from 'moment-timezone'
import { config } from 'src/system'

export * from './route-builder'

export const formatDate = (timestamp: number): string => {
  return moment(timestamp).tz(config.timezone).format('YYYY-MM-DD')
}

export const formatTime = (timestamp: number): string => {
  return moment(timestamp).tz(config.timezone).format('HH:mm')
}

export const addMinutes = (time: string, minutesToAdd: number) => {
  const [hours, minutes] = time.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + minutesToAdd
  const newHours = Math.floor((totalMinutes / 60) % 24)
  const newMinutes = totalMinutes % 60
  return `${time} - ${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
