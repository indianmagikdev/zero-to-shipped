export default function SubmissionReceipt({ submission, onAgain }) {
  return (
    <section className="submission-receipt" aria-live="polite">
      <div className="receipt-icon" aria-hidden="true">✓</div>
      <p className="receipt-eyebrow">Analysis complete</p>
      <h2>Your resume score</h2>
      <p className="receipt-file">📄 {submission.fileName}</p>
      <p className="score-value" aria-label={`Score ${submission.score} out of 100`}>
        <strong>{submission.score}</strong>
        <span>/ 100</span>
      </p>
      <div className="skill-results">
        <section className="skill-group">
          <h3>Matched skills</h3>
          {submission.matchedSkills?.length ? (
            <ul className="skill-list matched-skills">
              {submission.matchedSkills.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          ) : (
            <p className="receipt-copy">No matching skills were identified.</p>
          )}
        </section>
        <section className="skill-group">
          <h3>Skills to build</h3>
          {submission.missingSkills?.length ? (
            <ul className="skill-list missing-skills">
              {submission.missingSkills.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          ) : (
            <p className="receipt-copy">No missing skills were identified.</p>
          )}
        </section>
      </div>
      <p className="receipt-id">Submission ID: {submission.id}</p>
      <button className="again-btn" type="button" onClick={onAgain}>
        Submit another resume
      </button>
    </section>
  );
}
