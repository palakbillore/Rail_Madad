import Icon from '../../../components/common/Icon'

const GOV_NAVY = '#0f2747'
const GOV_ORANGE = '#ff6b00'

const features = [
  {
    icon: 'confirmation_number',
    title: 'PNR Status',
    desc: 'Real-time passenger name record lookup for instant travel updates.',
  },

  {
    icon: 'edit_note',
    title: 'File Complaints',
    desc: 'Submit and track grievances with secure evidence attachments.',
  },

  {
    icon: 'psychology',
    title: 'AI Analysis',
    desc: 'Intelligent complaint categorization with smart guidance.',
  },

  {
    icon: 'forum',
    title: 'Rail Sahayak',
    desc: 'AI-powered multilingual assistant for railway passenger support.',
  },

  {
    icon: 'lock',
    title: 'Secure Access',
    desc: 'Protected authentication with secure citizen account handling.',
  },

  {
    icon: 'cloud_upload',
    title: 'Cloud Uploads',
    desc: 'Attach complaint images and supporting evidence seamlessly.',
  },
]

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-24"
      style={{
        background: '#f8fafc',
      }}
    >
      {/* DECOR */}

      <div
        className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'rgba(255,107,0,0.05)',
          transform: 'translate(30%, -40%)',
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'rgba(15,39,71,0.04)',
          transform: 'translate(-40%, 40%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6">
        
        {/* HEADER */}

        <div className="text-center mb-16">
          
          <div
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-6"
            style={{
              background: '#fff',
              border: '1px solid #e5eaf2',
            }}
          >
            <div
              className="size-2 rounded-full"
              style={{
                background: GOV_ORANGE,
              }}
            />

            <span
              className="text-xs font-black uppercase tracking-[0.18em]"
              style={{
                color: GOV_NAVY,
              }}
            >
              About The Platform
            </span>
          </div>

          <h2
            className="text-4xl lg:text-5xl font-black tracking-tight"
            style={{
              color: '#0f172a',
            }}
          >
            Modern Railway
            <span
              className="block mt-2"
              style={{
                color: GOV_NAVY,
              }}
            >
              Citizen Assistance Platform
            </span>
          </h2>

          <p className="text-slate-500 text-lg leading-relaxed max-w-3xl mx-auto mt-6">
            Everything a passenger needs to raise, track and
            resolve a railway grievance, in one place.
          </p>
        </div>

        {/* FEATURE GRID */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-[2rem] p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{
                background: '#fff',

                border: '1px solid #e5eaf2',
              }}
            >
              {/* TOP BORDER */}

              <div
                className="absolute top-0 left-0 h-1 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to right, ${GOV_ORANGE}, #ffb067)`,
                }}
              />

              {/* LARGE BG ICON */}

              <div className="absolute -top-5 -right-5 opacity-[0.04] group-hover:opacity-[0.08] transition-all duration-500">
                <Icon
                  name={feature.icon}
                  size="text-[120px]"
                  style={{
                    color: GOV_NAVY,
                  }}
                />
              </div>

              {/* ICON */}

              <div
                className="relative z-10 size-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                style={{
                  background:
                    'linear-gradient(135deg, #eef3fb, #f8fafc)',

                  border:
                    '1px solid rgba(15,39,71,0.08)',
                }}
              >
                <Icon
                  name={feature.icon}
                  fill
                  size="text-2xl"
                  style={{
                    color: GOV_NAVY,
                  }}
                />
              </div>

              {/* TITLE */}

              <h3
                className="relative z-10 text-2xl font-black tracking-tight mb-4"
                style={{
                  color: '#0f172a',
                }}
              >
                {feature.title}
              </h3>

              {/* DESC */}

              <p className="relative z-10 text-slate-500 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* BOTTOM STRIP */}

        <div
          className="mt-16 rounded-[2rem] p-8 lg:p-10"
          style={{
            background: GOV_NAVY,
          }}
        >
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-blue-200 font-bold">
                Official Railway Support
              </p>

              <h3 className="text-3xl font-black text-white mt-3 leading-tight">
                Citizen-First
                <br />
                Digital Infrastructure
              </h3>
            </div>

            <div className="lg:col-span-2 grid sm:grid-cols-3 gap-5">
              
              {[
                {
                  label: '24×7 Support',
                  icon: 'support_agent',
                },

                {
                  label: 'AI Powered',
                  icon: 'smart_toy',
                },

                {
                  label: 'Secure Platform',
                  icon: 'verified_user',
                },
              ].map(item => (
                <div
                  key={item.label}
                  className="rounded-2xl p-5"
                  style={{
                    background:
                      'rgba(255,255,255,0.06)',

                    border:
                      '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    className="size-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background:
                        'rgba(255,255,255,0.08)',
                    }}
                  >
                    <Icon
                      name={item.icon}
                      fill
                      size="text-xl"
                      style={{
                        color: GOV_ORANGE,
                      }}
                    />
                  </div>

                  <p className="text-white font-semibold">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}