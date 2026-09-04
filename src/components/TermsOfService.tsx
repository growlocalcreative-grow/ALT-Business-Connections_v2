import { motion } from "motion/react";
import { Section } from "./UI";

export const TermsOfService = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#fbfaf8]">
      <Section
        title="Terms of Service"
        subtitle="Last updated: September 3, 2026"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 prose prose-slate"
        >
          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-[#1a3a3a] mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using the ALT Business Connections website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a3a3a] mb-4">2. Community Cooperative</h2>
              <p>
                ALT Business Connections is a neighborly cooperative for home-based and small business owners in Auburn Lake Trails (ALT). Our platform is designed to promote local services and foster community collaboration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a3a3a] mb-4">3. Business Listings</h2>
              <p>
                When you submit a business to our directory, you represent that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The information provided is accurate and truthful.</li>
                <li>You have the right to promote the business in Auburn Lake Trails.</li>
                <li>Your services comply with local regulations and community guidelines.</li>
              </ul>
              <p className="mt-4">
                We reserve the right to review, edit, or remove any listing that we deem inappropriate, inaccurate, or contrary to the community spirit of the cooperative.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a3a3a] mb-4">4. ABC Club Membership</h2>
              <p>
                Membership in the ALT Business Connections (ABC) Club is subject to approval by the organizing committee. Membership benefits, including collaborative booths and specialized promotion, are provided as a community service and may be subject to additional guidelines for specific events.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a3a3a] mb-4">5. Limitation of Liability</h2>
              <p>
                ALT Business Connections and its organizers act as a directory and facilitation service. We do not guarantee the quality of services provided by listed businesses, nor are we liable for any disputes, damages, or losses resulting from interactions between community members and listed businesses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a3a3a] mb-4">6. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes by updating the "Last updated" date at the top of this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1a3a3a] mb-4">7. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact Annette Gregg at annettegregg@kw.com.
              </p>
            </section>
          </div>
        </motion.div>
      </Section>
    </div>
  );
};
