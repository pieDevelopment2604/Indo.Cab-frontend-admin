import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

interface Props {
  children: React.ReactNode
}

export default function RecaptchaProvider({ children }: Props) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
    >
      {children}
    </GoogleReCaptchaProvider>
  )
}