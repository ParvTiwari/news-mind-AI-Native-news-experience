export default function NewsCard({ article, onAsk }) {
  return (
    <article className="card">
      <div className="card-top">
        <span className="tag">{article.source}</span>
        <small>{new Date(article.publishedAt).toLocaleString()}</small>
      </div>
      <h3>{article.title}</h3>
      <p>{article.summary || article.description}</p>
      <div className="insight">
        <strong>Why it matters</strong>
        <p>{article.whyItMatters}</p>
      </div>
      <small className="reason">{article.relevanceReason}</small>
      <div className="card-actions">
        <button type="button" className="secondary" onClick={() => onAsk(article)}>
          Ask about this
        </button>
        <a href={article.url} target="_blank" rel="noreferrer" className="link-btn">
          Read source
        </a>
      </div>
    </article>
  );
}
