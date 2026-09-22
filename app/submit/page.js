import SubmitForm from "./submit-form.js";
import SiteHeader from "../site-header.js";

export const dynamic = "force-dynamic";

export default async function SubmitPage({ searchParams }) {
  const params = await searchParams;
  const error = typeof params?.error === "string" ? params.error : "";

  return (
    <main>
      <SiteHeader />
      <SubmitForm error={error} />
    </main>
  );
}
