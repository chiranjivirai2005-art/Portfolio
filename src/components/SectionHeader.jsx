function SectionHeader({ kicker, title, description }) {
  return (
    <div className="ink-panel section-bot-anchor relative mb-8 rounded-lg p-6 md:p-8">
      <div className="header-bot" aria-hidden="true">
        <span className="header-bot-cable" />
        <span className="header-bot-head">
          <span />
          <span />
        </span>
        <span className="header-bot-body">HI</span>
      </div>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f0b765]">
        {kicker}
      </p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-normal text-white md:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">{description}</p>
      ) : null}
    </div>
  )
}

export default SectionHeader
