import { useEffect, useState } from 'react'

const robotMoments = [
  { variant: 'curious', label: 'AI', top: '18vh', left: '74vw', delay: '0s' },
  { variant: 'peek-soft', label: 'HI', top: '34vh', left: '-44px', delay: '0.2s' },
  { variant: 'float-scan', label: 'ECE', top: '58vh', left: '12vw', delay: '0.1s' },
  { variant: 'nap', label: 'Zz', top: '72vh', left: '68vw', delay: '0.3s' },
  { variant: 'ghost-soft', label: '404', top: '48vh', left: '5vw', delay: '0s' },
]

function getNextMoment() {
  return {
    ...robotMoments[Math.floor(Math.random() * robotMoments.length)],
    scale: (0.82 + Math.random() * 0.28).toFixed(2),
    drift: `${Math.round(18 + Math.random() * 36)}px`,
    duration: `${Math.round(5200 + Math.random() * 5200)}ms`,
  }
}

function RobotFigure({ variant, label, style }) {
  return (
    <div className={`robot robot-${variant}`} style={style} aria-hidden="true">
      <div className="robot-cable" />
      <div className="robot-head">
        <span className="robot-eye" />
        <span className="robot-eye" />
      </div>
      <div className="robot-body">
        <span>{label}</span>
      </div>
      <div className="robot-arm robot-arm-left" />
      <div className="robot-arm robot-arm-right" />
      <div className="robot-leg robot-leg-left" />
      <div className="robot-leg robot-leg-right" />
    </div>
  )
}

function NeonRobots() {
  const [moments, setMoments] = useState(() => [getNextMoment(), getNextMoment()])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMoments([getNextMoment(), getNextMoment()])
    }, 7200)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <>
      <div className="neon-robot-layer" aria-hidden="true">
        <div className="neon-grid" />
        <RobotFigure variant="walker" label="AI" />
        <RobotFigure variant="hanger" label="DEV" />
      </div>
      <div className="robot-foreground-layer" aria-hidden="true">
        {moments.map((moment, index) => (
          <RobotFigure
            key={`${moment.variant}-${index}-${moment.duration}`}
            variant={moment.variant}
            label={moment.label}
            style={{
              '--robot-drift': moment.drift,
              '--robot-scale': moment.scale,
              animationDelay: moment.delay,
              animationDuration: moment.duration,
              left: moment.left,
              top: moment.top,
            }}
          />
        ))}
      </div>
    </>
  )
}

export default NeonRobots
