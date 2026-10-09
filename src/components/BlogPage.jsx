import { useEffect } from "react";
import { useLocale } from "../i18n/LocaleContext";
import { Link } from "../router";
import { posts, getPost, toBlocks, formatDate } from "../blog/posts";
import Embed from "./Embed";

export function BlogList() {
  const { data } = useLocale();
  const b = data.ui.blog;

  return (
    <section className="page blog-page">
      <Link to="/" className="backlink">
        {b.back}
      </Link>
      <h2 className="page-heading">{b.heading}</h2>

      {posts.length === 0 ? (
        <p className="muted">{b.soon}</p>
      ) : (
        <ul className="postlist">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link to={`/blog/${p.slug}`} className="postrow">
                <time className="mono" dateTime={p.date}>
                  {formatDate(p.date)}
                </time>
                <span className="postrow-main">
                  <span className="postrow-title">{p.title}</span>
                  {p.summary && <span className="postrow-summary">{p.summary}</span>}
                </span>
                <span className="postrow-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function BlogPost({ slug }) {
  const { data } = useLocale();
  const b = data.ui.blog;
  const post = getPost(slug);

  useEffect(() => {
    if (!post) return;
    const prev = document.title;
    document.title = `${post.title} — Kent Shen`;
    return () => {
      document.title = prev;
    };
  }, [post]);

  if (!post) {
    return (
      <section className="page blog-page">
        <Link to="/blog" className="backlink">
          {b.backToList}
        </Link>
        <h2 className="page-heading">{b.notFound}</h2>
      </section>
    );
  }

  return (
    <article className="page blog-page post">
      <Link to="/blog" className="backlink">
        {b.backToList}
      </Link>
      <header className="post-head">
        <time className="mono" dateTime={post.date}>
          {formatDate(post.date)}
        </time>
        <h1 className="post-title">{post.title}</h1>
        {post.tags.length > 0 && (
          <ul className="tags">
            {post.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </header>

      <div className="prose">
        {toBlocks(post.body).map((blk, i) =>
          blk.type === "embed" ? (
            <Embed key={i} url={blk.url} title={blk.title} desc={blk.desc} />
          ) : (
            <div key={i} dangerouslySetInnerHTML={{ __html: blk.html }} />
          )
        )}
      </div>
    </article>
  );
}
