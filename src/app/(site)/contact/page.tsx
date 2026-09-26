import { siteMetadata } from "@/lib/content/metadata";
import { getContentRepository } from "@/lib/content/repository";
export const generateMetadata = () => siteMetadata("Contact", "/contact");
export default async function Contact() {
  const settings = await getContentRepository().settings();
  return (
    <main className="standalone screen" id="main">
      <h1>Contact</h1>
      {settings.contactLinks.length ? (
        settings.contactLinks.map((l) => (
          <p key={l.url}>
            <a href={l.url}>{l.label}</a>
          </p>
        ))
      ) : (
        <p>Contact details are not yet published.</p>
      )}
    </main>
  );
}
