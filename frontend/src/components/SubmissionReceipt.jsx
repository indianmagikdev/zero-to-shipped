export default function SubmissionReceipt({ submission, onAgain }) {
  return (
    <section className="submission-receipt" aria-live="polite">
      <div className="receipt-icon" aria-hidden="true">✓</div>
      <p className="receipt-eyebrow">Submission received</p>
      <h2>Your comparison is queued</h2>
      <p className="receipt-file">📄 {submission.fileName}</p>
      <p className="receipt-copy">
        Your resume PDF and job description were saved for future processing. The AI comparison
        engine is not enabled yet, so scores and skill matches will be available in a future update.
      </p>
      <p className="receipt-id">Submission ID: {submission.id}</p>
      <button className="again-btn" type="button" onClick={onAgain}>
        Submit another resume
      </button>
    </section>
  );
}
