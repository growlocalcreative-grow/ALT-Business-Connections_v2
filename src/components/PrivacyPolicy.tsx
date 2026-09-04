import { motion } from "motion/react";
import { Section } from "./UI";

export const PrivacyPolicy = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#fbfaf8]">
      <Section
        title="Privacy Policy"
        subtitle="Last updated: September 3, 2026"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 prose prose-slate"
        >
          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-[#1a3a3a] mb-4">1. Introduction</h2>
              <p>
                Welcome to ALT Business Connections. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a3a3a] mb-4">2. Information We Collect</h2>
              <p>
                We collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Register for a membership application</li>
                <li>Submit a business listing for our directory</li>
                <li>Contact us through our contact forms</li>
                <li>Sign up for our newsletter or event notifications</li>
              </ul>
              <p className="mt-4">
                This information may include your name, email address, phone number, business details, and any other information you choose to provide.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a3a3a] mb-4">3. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our business directory</li>
                <li>Process your membership applications</li>
                <li>Communicate with you about community events and opportunities</li>
                <li>Promote local businesses within the Auburn Lake Trails community</li>
                <li>Improve our website and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a3a3a] mb-4">4. Sharing Your Information</h2>
              <p>
                As a community directory, the business information you provide for a listing is intended to be public. However, we do not sell or rent your private contact information (like your personal email or phone number if not part of the public listing) to third parties.
              </p>
              <p className="mt-4">
                We may share information with Annette Gregg and the ALT Business Connections organizing committee to facilitate community activities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a3a3a] mb-4">5. Data Security</h2>
              <p>
                We use appropriate technical and organizational security measures to protect the security of any personal information we process. However, please remember that no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a3a3a] mb-4">6. Contact Us</h2>
              <p>
                If you have questions or comments about this policy, you may contact us at:
              </p>
              <p className="mt-2 font-bold text-[#1a3a3a]">
                Annette Gregg<br />
                annettegregg@kw.com<br />
                Auburn Lake Trails, CA
              </p>
            </section>
          </div>
        </motion.div>
      </Section>
    </div>
  );
};
