import { useNavigate } from 'react-router-dom'
import Icon from '../../../components/common/Icon'
import { useTranslation } from 'react-i18next'

const GOV_NAVY = '#1a3a6b'
const GOV_ORANGE = '#ff6b00'

export default function HeroSection() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{
        background: '#f4f7fb',
      }}
    >
      {/* TOP STRIP */}

    

      {/* DECOR */}

      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'rgba(26,58,107,0.05)',
          transform: 'translate(30%, -40%)',
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'rgba(255,107,0,0.05)',
          transform: 'translate(-40%, 40%)',
        }}
      />

      {/* MAIN */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          
          {/* LEFT CONTENT */}

          <div className="text-center lg:text-left animate-fade-in">
            
            {/* BADGE */}

            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 shadow-sm"
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
                className="text-xs font-bold uppercase tracking-[0.18em]"
                style={{
                  color: GOV_NAVY,
                }}
              >
                {t('landing.badge')}
              </span>
            </div>

            {/* HEADING */}

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight"
              style={{ color: '#0f172a' }}
            >
              Railway complaints,
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${GOV_ORANGE}, #ff9b52)`,
                }}
              >
                resolved faster.
              </span>
            </h1>

            {/* SUBTEXT */}

            <p className="text-base sm:text-lg text-slate-500 leading-relaxed mt-7 max-w-2xl mx-auto lg:mx-0">
              File a complaint, attach evidence and follow its
              status until it is resolved. Rail Sahayak, our
              multilingual AI assistant, guides you at every step.
            </p>

            {/* ACTION BUTTONS */}

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-10">
              
              <button
                onClick={() => navigate('/register')}
                className="group w-full sm:w-auto h-14 px-8 rounded-2xl text-white font-semibold flex items-center justify-center gap-3 shadow-sm transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: GOV_NAVY,
                }}
              >
                <Icon
                  name="campaign"
                  fill
                  size="text-lg"
                />

                {t('common.fileComplaint')}

                <Icon
                  name="arrow_forward"
                  size="text-lg"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() => navigate('/track')}
                className="group w-full sm:w-auto h-14 px-8 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:bg-slate-50"
                style={{
                  background: '#fff',
                  border: '1px solid #dbe3ed',
                  color: GOV_NAVY,
                }}
              >
                <Icon
                  name="track_changes"
                  fill
                  size="text-lg"
                />

                {t('common.trackComplaint')}
              </button>
            </div>
          </div>

          {/* RIGHT VISUAL */}

          <div className="relative lg:mt-10">
            
            {/* GLOW */}

            <div
              className="absolute inset-0 rounded-[3rem] blur-3xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(26,58,107,0.12), rgba(255,107,0,0.08))',
              }}
            />

            {/* MAIN CARD */}

            <div
              className="relative rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.01]"
              style={{
                background:
                  'rgba(255,255,255,0.72)',

                backdropFilter: 'blur(16px)',

                border:
                  '1px solid rgba(255,255,255,0.6)',
              }}
            >
              {/* IMAGE */}

              <div className="relative p-5">
                <img
                  src="/hero_train.png"
                  alt={t('landing.portal')}
                  className="w-full h-auto rounded-[2rem] object-cover shadow-lg"
                />

                {/* FLOATING CARD */}

                <div
                  className="absolute bottom-10 left-10 right-10 rounded-2xl p-4 shadow-xl"
                  style={{
                    background:
                      'rgba(255,255,255,0.92)',

                    backdropFilter: 'blur(10px)',

                    border:
                      '1px solid rgba(255,255,255,0.8)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    
                    <div
                      className="size-14 rounded-2xl flex items-center justify-center"
                      style={{
                        background: '#eef3fb',
                      }}
                    >
                      <Icon
                        name="smart_toy"
                        fill
                        size="text-2xl"
                        style={{
                          color: GOV_NAVY,
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <p
                        className="font-semibold"
                        style={{
                          color: GOV_NAVY,
                        }}
                      >
                        {t('landing.railSahayak')}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {t('landing.assistant')}
                      </p>
                    </div>

                    <div
                      className="size-3 rounded-full animate-pulse"
                      style={{
                        background: '#22c55e',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* FLOATING INFO */}

            <div
              className="hidden xl:flex absolute -left-10 top-16 rounded-2xl px-5 py-4 shadow-xl items-center gap-4"
              style={{
                background: '#fff',
                border: '1px solid #e5eaf2',
              }}
            >
              <div
                className="size-12 rounded-xl flex items-center justify-center"
                style={{
                  background: '#ecfdf3',
                }}
              >
                <Icon
                  name="verified"
                  fill
                  size="text-xl"
                  style={{
                    color: '#16a34a',
                  }}
                />
              </div>

              <div>
                <p className="font-semibold text-slate-800">
                  {t('landing.trusted')}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {t('landing.officialSupport')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
