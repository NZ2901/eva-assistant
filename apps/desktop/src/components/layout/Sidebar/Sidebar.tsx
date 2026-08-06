import { motion } from 'framer-motion';
import {
  Brain,
  House,
  MessageSquare,
  Mic,
  Settings,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const menu = [
  {
    icon: House,
    label: 'Dashboard',
    path: '/',
  },
  {
    icon: MessageSquare,
    label: 'Chat',
    path: '/chat',
  },
  {
    icon: Brain,
    label: 'Memory',
    path: '/memory',
  },
  {
    icon: Mic,
    label: 'Voice',
    path: '/voice',
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/settings',
  },
];

export function Sidebar() {
  return (
    <aside
      className="
        flex
        h-screen
        w-72
        flex-col
        border-r
        border-blue-500/10
        bg-[#070B14]/90
        backdrop-blur-xl
      "
    >
      {/* Logo */}
      <div className="border-b border-blue-500/10 px-8 py-8">
        <h1 className="text-3xl font-bold tracking-[0.35em] text-white">
          EVA
        </h1>

        <p className="mt-2 text-sm text-blue-300/60">
          Artificial Assistant
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-8">
        <div className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink key={item.label} to={item.path}>
                {({ isActive }) => (
                  <motion.div
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.2 }}
                    className={`
                      relative
                      flex
                      items-center
                      gap-4
                      rounded-xl
                      px-5
                      py-4
                      transition-all
                      duration-300
                      ${
                        isActive
                          ? 'border border-blue-500/20 bg-blue-500/10 text-blue-300 shadow-[0_0_25px_rgba(59,130,246,.18)]'
                          : 'text-white/70 hover:bg-blue-500/5 hover:text-white'
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-sidebar"
                        className="
                          absolute
                          bottom-2
                          left-0
                          top-2
                          w-1
                          rounded-full
                          bg-blue-400
                        "
                      />
                    )}

                    <Icon size={22} />

                    <span className="font-medium">
                      {item.label}
                    </span>
                  </motion.div>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Rodapé */}
      <div className="border-t border-blue-500/10 p-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="
            flex
            items-center
            gap-3
            rounded-xl
            p-3
            transition-colors
            hover:bg-blue-500/5
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-gradient-to-br
              from-blue-400
              to-blue-700
              font-bold
              text-white
            "
          >
            J
          </div>

          <div>
            <p className="font-medium text-white">
              João Nazzi
            </p>

            <p className="text-sm text-blue-300/60">
              Developer
            </p>
          </div>
        </motion.div>
      </div>
    </aside>
  );
}