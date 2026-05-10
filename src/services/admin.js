export const adminEmail = import.meta.env.VITE_ADMIN_EMAIL

export function isAdminUser(user) {
  return Boolean(user?.email && adminEmail && user.email.toLowerCase() === adminEmail.toLowerCase())
}
