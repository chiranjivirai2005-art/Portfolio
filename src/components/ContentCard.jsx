function ContentCard({ eyebrow, title, children, imageUrl }) {
  const variants = ['sitter', 'hanger', 'tumbler', 'stargazer']
  const variant = variants[title.length % variants.length]

  return (
    <article className="portfolio-card group relative rounded-lg transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className={`card-bot card-bot-${variant}`} aria-hidden="true">
        <span className="card-bot-star star-one">*</span>
        <span className="card-bot-star star-two">*</span>
        <span className="card-bot-head">
          <span className="card-bot-antenna" />
          <span className="card-bot-eye" />
          <span className="card-bot-eye" />
        </span>
        <span className="card-bot-body">
          <span className="card-bot-panel" />
        </span>
        <span className="card-bot-arm card-bot-arm-left" />
        <span className="card-bot-arm card-bot-arm-right" />
        <span className="card-bot-leg card-bot-leg-left" />
        <span className="card-bot-leg card-bot-leg-right" />
      </div>
      {imageUrl ? (
        <img className="h-52 w-full object-cover" src={imageUrl} alt={title} />
      ) : null}
      <div className="p-5">
        {eyebrow ? <p className="text-sm font-semibold text-[#1f6f78]">{eyebrow}</p> : null}
        <h2 className="mt-2 text-xl font-semibold text-slate-950">{title}</h2>
        <div className="mt-3 text-sm leading-6 text-slate-600">{children}</div>
      </div>
    </article>
  )
}

export default ContentCard
