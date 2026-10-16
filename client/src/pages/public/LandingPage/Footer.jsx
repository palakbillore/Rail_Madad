import { useNavigate } from 'react-router-dom'
import Icon from '../../../components/common/Icon'
import { useTranslation } from 'react-i18next'

const GOV_NAVY = '#0f2747'
const GOV_ORANGE = '#ff6b00'

export default function Footer() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const footerSections = [
    {
      title: t('landing.citizenServices'),

      links: [
        {
          label: t('common.fileComplaint'),
          path: '/file-complaint',
        },

        {
          label: t('common.trackComplaint'),
          path: '/track',
        },

        {
          label: t('common.faq'),
          path: '/faq',
        },

        {
          label: t('common.privacyPolicy'),
          path: '/privacy',
        },
      ],
    },

    {
      title: t('landing.railwayServices'),

      links: [
        {
          label: 'Indian Railways',
          external: 'https://indianrailways.gov.in/',
        },

        {
          label: 'IRCTC',
          external: 'https://www.irctc.co.in/',
        },

        {
          label: 'National Train Enquiry',
          external:
            'https://enquiry.indianrail.gov.in/',
        },

        {
          label: 'Rail Madad (In Progess)',
          external:
            'https://railmadad.indianrailways.gov.in/',
        },
      ],
    },

    {
      title: t('landing.governmentPortals'),

      links: [
        {
          label: 'Digital India',
          external:
            'https://www.digitalindia.gov.in/',
        },

        {
          label: 'India.gov.in',
          external: 'https://www.india.gov.in/',
        },

        {
          label: 'MyGov',
          external: 'https://www.mygov.in/',
        },

        {
          label: 'NIC',
          external: 'https://www.nic.in/',
        },
      ],
    },
  ]

  return (
    <footer
      className="relative overflow-hidden text-white"
      style={{
        background: GOV_NAVY,
      }}
    >
      {/* TOP BORDER */}

      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(to right, ${GOV_ORANGE}, #ffb067, ${GOV_ORANGE})`,
        }}
      />

      {/* DECOR */}

      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'rgba(255,255,255,0.03)',
          transform: 'translate(30%, -40%)',
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'rgba(255,107,0,0.05)',
          transform: 'translate(-40%, 40%)',
        }}
      />

      {/* MAIN */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 py-14">

        {/* TOP SECTION */}

        <div className="grid lg:grid-cols-[1.3fr_2fr] gap-12 pb-12 border-b border-white/10">

          {/* LEFT */}

          <div>
            {/* BRAND */}

            <div className="flex items-center gap-5">

              <div className="flex items-center gap-4">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="Government of India"
                  className="h-14 w-auto invert"
                />

                <div
                  className="h-10 w-[1px]"
                  style={{
                    background:
                      'rgba(255,255,255,0.15)',
                  }}
                />
              </div>


            </div>

            {/* DESCRIPTION */}

            <p className="text-sm text-slate-300 leading-relaxed mt-6 max-w-md">
              Official grievance redressal platform of Indian
              Railways, Government of India.
            </p>

            {/* BADGES */}

            <div className="flex flex-wrap gap-3 mt-6">

              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{
                  background:
                    'rgba(255,255,255,0.06)',

                  border:
                    '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Icon
                  name="verified"
                  fill
                  size="text-base"
                  style={{
                    color: '#4ade80',
                  }}
                />

                <span className="text-xs font-medium text-slate-200">
                  Official Portal
                </span>
              </div>

              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{
                  background:
                    'rgba(255,255,255,0.06)',

                  border:
                    '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Icon
                  name="support_agent"
                  fill
                  size="text-base"
                  style={{
                    color: '#60a5fa',
                  }}
                />

                <span className="text-xs font-medium text-slate-200">
                  24×7 Support
                </span>
              </div>
            </div>

            {/* HELPLINE */}

            <div
              className="mt-8 rounded-2xl p-5"
              style={{
                background:
                  'rgba(255,255,255,0.05)',

                border:
                  '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-center gap-4">

                <div
                  className="size-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      'rgba(255,255,255,0.08)',
                  }}
                >
                  <Icon
                    name="call"
                    fill
                    size="text-2xl"
                    style={{
                      color: GOV_ORANGE,
                    }}
                  />
                </div>

                <div>
                  <p className="text-sm text-slate-300">
                    Railway Helpline
                  </p>

                  <h3 className="text-2xl font-black mt-1">
                    139
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT LINKS */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {footerSections.map(section => (
              <div key={section.title}>

                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white mb-5">
                  {section.title}
                </h3>

                <div className="space-y-4">
                  {section.links.map(link => (
                    <button
                      key={link.label}
                      onClick={() => {
                        if (link.path) {
                          navigate(link.path)
                        }

                        if (link.external) {
                          window.open(
                            link.external,
                            '_blank'
                          )
                        }
                      }}
                      className="group flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-all duration-200"
                    >
                      <Icon
                        name="chevron_right"
                        size="text-base"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                        style={{
                          color: GOV_ORANGE,
                        }}
                      />

                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GOV LOGOS */}

        <div className="py-10 border-b border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 items-center">

            {[
              {
                label: 'Indian Railways',

                image:
                  'https://res.cloudinary.com/dwemivxbp/image/upload/v1779735545/indian-railways-logo_q0ztvk.png',
              },

              {
                label: 'Digital India',

                image:
                  '/digital_india_logo.svg',
              },

              {
                label: 'IRCTC',

                image:
                  'https://res.cloudinary.com/dwemivxbp/image/upload/v1779735871/b7114f10bbd203a7b97eaea45f9b7c-removebg-preview_iyf3kw.png',
              },

              {
                label: 'Government of India',

                image:
                  'https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg',
                invert: true,
              },
            ].map(item => (
              <div
                key={item.label}
                className="group flex flex-col items-center justify-center gap-3 opacity-80 hover:opacity-100 transition-all duration-300"
              >
                <div
                  className="h-20 w-full rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      'rgba(255,255,255,0.04)',

                    border:
                      '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.label}
                    className={`h-12 w-auto transition-transform duration-300 group-hover:scale-110 ${
                      item.invert
                        ? 'invert'
                        : ''
                    }`}
                  />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM */}

        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-5">

          <p className="text-xs text-slate-400 text-center lg:text-left leading-relaxed">
            © 2026 Rail Madad. All Rights Reserved.
            <br className="hidden sm:block" />
            Government of India.
          </p>

          {/* QUICK BOTTOM LINKS */}

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">

            {[
              {
                label: 'Terms & Conditions',
                path: '/terms',
              },

              {
                label: 'Privacy Policy',
                path: '/privacy',
              },

              {
                label: 'Accessibility',
                path: '/accessibility',
              },

              {
                label: 'Contact Us',
                path: '/contact',
              },
            ].map(link => (
              <button
                key={link.label}
                onClick={() =>
                  navigate(link.path)
                }
                className="text-slate-400 hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
