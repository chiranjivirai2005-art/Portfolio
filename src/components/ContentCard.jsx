function ContentCard({ actions, children, eyebrow, highlighted = false, imageUrl, title }) {
  return (
    <article
      className={`portfolio-card group relative rounded-lg transition duration-200 hover:-translate-y-1 ${
        highlighted ? 'portfolio-card-highlight' : ''
      }`}
    >
      {imageUrl ? (
        <div className="relative h-52 overflow-hidden">
          <img className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" src={imageUrl} alt={title} />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,13,26,0.56),transparent_58%)]" />
        </div>
      ) : null}
      <div className="p-5">
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f8dfa6]">{eyebrow}</p> : null}
        <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
        <div className="mt-3 text-sm leading-6 text-slate-300">{children}</div>
        {actions ? <div className="mt-5 flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </article>
  )
}

export default ContentCard
