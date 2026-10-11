import { useState } from "react";

import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import UploadSection from "./components/UploadSection.jsx";
import SubmissionReceipt from "./components/SubmissionReceipt.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [submission, setSubmission] = useState(null);

  return (
    <>
      <Header />
      <main>
        <Hero />
        {submission ? (
          <SubmissionReceipt submission={submission} onAgain={() => setSubmission(null)} />
        ) : (
          <UploadSection onSubmitted={setSubmission} />
        )}
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
