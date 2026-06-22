// OTP generation + SMS via Fast2SMS (free Indian SMS provider)
// Sign up at https://www.fast2sms.com to get a free API key
// Without FAST2SMS_API_KEY set, OTP is printed to the server console (dev mode)

export function generateOTP(): string {
  // 6-digit OTP, cryptographically random
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return String(100000 + (array[0] % 900000))
}

export function normalizePhone(phone: string): string {
  // Strip +91 / 0 prefix, return bare 10-digit number
  return phone.replace(/\D/g, '').replace(/^(91|0)/, '').slice(-10)
}

export async function sendOTPSMS(phone: string, otp: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.FAST2SMS_API_KEY

  if (!apiKey) {
    // Dev mode — log to console instead of sending SMS
    console.log(`\n╔══════════════════════════════╗`)
    console.log(`║  [ChefCircle DEV OTP]        ║`)
    console.log(`║  Phone : +91 ${phone}       ║`)
    console.log(`║  OTP   : ${otp}              ║`)
    console.log(`╚══════════════════════════════╝\n`)
    return { success: true }
  }

  try {
    // Fast2SMS Bulk API — OTP route
    const url = new URL('https://www.fast2sms.com/dev/bulkV2')
    url.searchParams.set('authorization', apiKey)
    url.searchParams.set('route', 'otp')
    url.searchParams.set('variables_values', otp)
    url.searchParams.set('flash', '0')
    url.searchParams.set('numbers', phone)

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'cache-control': 'no-cache' },
    })

    const json = await res.json()

    if (json.return === true) return { success: true }
    return { success: false, error: json.message || 'SMS delivery failed' }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}
