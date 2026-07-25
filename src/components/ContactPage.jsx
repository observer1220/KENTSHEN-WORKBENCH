import { useState } from "react";
import { useLocale } from "../i18n/LocaleContext";

// TODO(Kent): replace with your real email address before deploying.
const CONTACT_EMAIL = "observer1220@gmail.com";

export default function ContactPage({ onBack }) {
  const { data } = useLocale();
  const c = data.ui.contact;
  const categories = Object.keys(c.categoryOptions);

  const [category, setCategory] = useState(categories[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [desc, setDesc] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const subject = `[${c.categoryOptions[category]}] ${name}`;
    const body = [
      `${c.categoryLabel}: ${c.categoryOptions[category]}`,
      `${c.nameLabel}: ${name}`,
      `${c.phoneLabel}: ${phone || "-"}`,
      `${c.emailLabel}: ${email}`,
      "",
      desc
    ].join("\n");
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  return (
    <section className="log contact-page">
      <button type="button" className="backlink" onClick={onBack}>
        {c.backLabel}
      </button>

      <div className="sectionlabel">{c.heading}</div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>{c.categoryLabel}</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((key) => (
              <option key={key} value={key}>
                {c.categoryOptions[key]}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>{c.nameLabel}</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label className="field">
          <span>{c.phoneLabel}</span>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>

        <label className="field">
          <span>{c.emailLabel}</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label className="field field-wide">
          <span>{c.descLabel}</span>
          <textarea rows={6} value={desc} onChange={(e) => setDesc(e.target.value)} required />
        </label>

        <button type="submit" className="pagebtn contact-submit">
          {c.submitLabel}
        </button>
      </form>
    </section>
  );
}
