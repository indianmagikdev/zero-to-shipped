export default function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="how-card"><span className="how-step">1</span><h3>Upload</h3><p>Add your resume PDF and the target job description.</p></div>
      <div className="how-card"><span className="how-step">2</span><h3>Parse</h3><p>We extract readable text from your resume PDF.</p></div>
      <div className="how-card"><span className="how-step">3</span><h3>Compare</h3><p>Labd AI returns a match score and matched or missing skills.</p></div>
    </section>
  );
}
