import { useGraphStore } from '../../hooks/useGraphStore'
import Modal from './Modal'

const items = [
  {
    label: 'github.com/AdityaThakare72',
    href: 'https://github.com/AdityaThakare72',
    icon: (
      <path d="M9 19c-4.3 1.4-5-2-7-2m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3.1-.3 6.4-1.5 6.4-7A5.4 5.4 0 0 0 20 5.8 5 5 0 0 0 19.9 2S18.7 1.7 16 3.4a13.4 13.4 0 0 0-7 0C6.3 1.7 5.1 2 5.1 2A5 5 0 0 0 5 5.8a5.4 5.4 0 0 0-1.5 3.7c0 5.4 3.3 6.7 6.4 7a3.4 3.4 0 0 0-.9 2.6V23" />
    ),
  },
  {
    label: 'linkedin.com/in/aditya-thakare72',
    href: 'https://www.linkedin.com/in/aditya-thakare72/',
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v2a6 6 0 0 1 2-2Z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    label: 'adityathakare72@gmail.com',
    href: 'mailto:adityathakare72@gmail.com',
    icon: (
      <>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-10 6L2 7" />
      </>
    ),
  },
  {
    label: 'Pune, Maharashtra',
    icon: (
      <>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
]

export default function ContactOverlay() {
  const showContact = useGraphStore((s) => s.showContact)
  const setShowContact = useGraphStore((s) => s.setShowContact)

  return (
    <Modal open={showContact} onClose={() => setShowContact(false)}>
      <h2 className="text-2xl font-bold text-white">Get in Touch</h2>
      <ul className="mt-6 space-y-1">
        {items.map((item) => {
          const row = (
            <span className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors group-hover:bg-white/5 group-hover:text-white">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-sky-400"
              >
                {item.icon}
              </svg>
              {item.label}
            </span>
          )
          return (
            <li key={item.label}>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noreferrer" className="group block">
                  {row}
                </a>
              ) : (
                <span className="group block">{row}</span>
              )}
            </li>
          )
        })}
      </ul>
      <a
        href="/Aditya_Thakare_Resume.pdf"
        download
        className="mt-6 inline-block rounded-lg bg-sky-400 px-4 py-2 text-sm font-semibold text-gray-950 transition-colors hover:bg-sky-300"
      >
        Download Resume
      </a>
    </Modal>
  )
}
