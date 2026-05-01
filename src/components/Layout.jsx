import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { isAdminUser } from '../services/admin.js'
import NeonRobots from './NeonRobots.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/certificates', label: 'Certificates' },
  { to: '/courses', label: 'Courses' },
  { to: '/extracurricular', label: 'Extracurricular' },
  { to: '/gallery', label: 'Gallery' },
]

function Layout({ children }) {
  const { user } = useAuth()
  const isAdmin = isAdminUser(user)

  return (
    <div className="app-frame">
      <NeonRobots />
      <header className="glass-nav sticky top-0 z-30">
        <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <NavLink to="/" className="flex items-center gap-3 text-xl font-semibold text-white">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-400 text-sm font-black text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.55)]">
              CK
            </span>
            <span className="neon-name">Chiranjivi Kumar</span>
          </NavLink>
          <div className="flex flex-wrap items-center gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `nav-link rounded-md px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'nav-link-active'
                      : 'text-cyan-50/82 hover:bg-cyan-300/12 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAdmin ? (
              <NavLink
                to="/admin"
                  className={({ isActive }) =>
                    `nav-link rounded-md border px-3 py-2 text-sm font-semibold transition ${
                      isActive
                      ? 'nav-link-active border-cyan-300'
                      : 'border-cyan-200/25 bg-white/5 text-cyan-50/82 hover:border-cyan-300/70 hover:text-white'
                  }`
                }
              >
                Dashboard
              </NavLink>
            ) : null}
          </div>
        </nav>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 md:py-12">{children}</main>
    </div>
  )
}

export default Layout
