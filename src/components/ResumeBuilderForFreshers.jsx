import React from "react";
import { Link } from "react-router-dom";

const ResumeBuilderForFreshers = () => {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Top 5 Reasons Why Freshers Should Use an Online Resume Builder
      </h1>

      <p className="mb-4">
        Are you a fresher trying to make your first resume? You're not alone.
        With competition rising every day, your <strong>resume is your first impression</strong> —
        and you want to make it count.
      </p>

      <p className="mb-4">
        That’s why using an <strong>online resume builder</strong> can save you time and give you
        an edge over others.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Easy to Use – No Experience Needed</h2>
      <p className="mb-4">
        You don’t need to be a designer or a tech expert. Online resume makers like{" "}
        <a
          href="https://digitalresumebuilder.com"
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Digital Resume Builder
        </a>{" "}
        come with <strong>pre-designed templates</strong> that are easy to fill and edit.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. Easy Login </h2>
      <p className="mb-4">
        Easily you can signup using google just by one click. At{" "}
        <a
          href="https://digitalresumebuilder.com"
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Digital Resume Builder
        </a>
        , you can <strong>create and download your resume</strong>.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Professional Resume Templates</h2>
      <p className="mb-4">
        Hiring managers look at hundreds of resumes. A{" "}
        <strong>well-formatted, professional-looking</strong> resume instantly catches their eye.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Instant PDF Download</h2>
      <p className="mb-4">
        Once your resume is ready, simply click <strong>Download PDF</strong>. You can print it,
        attach it to emails, or upload it on job portals instantly.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Tailored for Freshers</h2>
      <p className="mb-4">
        We understand that freshers don’t have long work histories. That’s why our resume formats
        focus on:
      </p>

      <ul className="list-disc ml-6 mb-4">
        <li>Education</li>
        <li>Skills</li>
        <li>Certifications</li>
        <li>Projects</li>
        <li>Career Objective</li>
      </ul>

      <p className="mb-4">
        Everything that highlights your potential — even without job experience.
      </p>

      <h2 className="text-xl font-bold mt-6 mb-2">Final Thoughts</h2>
      <p className="mb-4">
        Building your resume doesn’t have to be complicated. Start with the right tool, save time,
        and focus on getting hired.
      </p>

      <p className="mb-6">
        👉{" "}
        <a
          href="https://digitalresumebuilder.com"
          className="text-blue-600 font-bold underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Click here to start building your resume now
        </a>
      </p>

      <h2 className="text-xl font-bold mt-6 mb-2">FAQ – Frequently Asked Questions</h2>

      <p className="mb-2 font-semibold">Q. Can I use Digital Resume Builder on my phone?</p>
      <p className="mb-4">Yes! It’s mobile-friendly and works on all devices.</p>



      <p className="mb-2 font-semibold">Q. Can I edit my resume later?</p>
      <p className="mb-8">Of course! You can come back anytime and update your details.</p>

      <Link to="/" className="text-blue-600 underline">
        ← Back to home
      </Link>
    </div>
  );
};

export default ResumeBuilderForFreshers;
