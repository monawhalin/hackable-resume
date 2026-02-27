import resume from "@/content/resume.json";

export default function PrintPage() {
  return (
    <main className="mx-auto max-w-4xl p-8 text-black bg-white min-h-screen print:p-4">
      <h1 className="text-3xl font-bold">{resume.basics.name}</h1>
      <p>{resume.basics.headline}</p>
      <p>{resume.basics.location} · {resume.contact.email}</p>
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Summary</h2>
        <p>{resume.basics.summary}</p>
      </section>
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Experience</h2>
        {resume.experience.map((exp) => (
          <article key={`${exp.company}-${exp.role}`} className="mt-3">
            <h3 className="font-semibold">{exp.role} — {exp.company}</h3>
            <p>{exp.dates}</p>
            <ul className="list-disc ml-6">
              {exp.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </article>
        ))}
      </section>
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Projects</h2>
        {resume.projects.map((project) => (
          <article key={project.slug} className="mt-2">
            <h3 className="font-semibold">{project.name}</h3>
            <p>{project.description}</p>
          </article>
        ))}
      </section>
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Skills</h2>
        {Object.entries(resume.skills).map(([k, v]) => <p key={k}><strong>{k}:</strong> {v.join(", ")}</p>)}
      </section>
    </main>
  );
}
