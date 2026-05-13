export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function getAge(dateOfBirth) {
  if (!dateOfBirth) return '—'
  const dob = new Date(dateOfBirth)
  const now = new Date()
  const months =
    (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth())
  if (months < 3) return `${Math.floor((now - dob) / 86_400_000)} days`
  if (months < 24) return `${months} months`
  return `${Math.floor(months / 12)} yrs ${months % 12}m`
}
