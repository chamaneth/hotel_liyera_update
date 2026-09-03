"use client";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <main className="font-sans antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      {/* ===== NAVBAR ===== */}
      <NavBar />

      {/* ===== HEADER ===== */}
      <section className="bg-gray-950 text-white pt-32 pb-16 px-4 text-center border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block py-1 px-4 mb-3 rounded-full border border-yellow-400/50 bg-black/40 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-yellow-400">
            Legal & Terms
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-3 tracking-wide">
            Privacy Policy & Terms
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            Standard Hospitality Transparency & Data Protection
          </p>
        </div>
      </section>

      {/* ===== POLICY CONTENT ===== */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-2">
              1. Information We Collect
            </h2>
            <p>
              At Hotel Liyera, guest privacy is paramount. When you reserve accommodations, request wedding and event banqueting proposals, or send an inquiry through our digital concierge, we collect necessary reservation details such as your name, email address, contact telephone, intended stay dates, and specific hospitality preferences.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-2">
              2. Utilization of Guest Information
            </h2>
            <p className="mb-2">The information collected is strictly utilized to:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
              <li>Process, assign, and confirm your accommodation and event bookings.</li>
              <li>Provide dedicated concierge customer service and answer inquiries.</li>
              <li>Continuously enhance resort amenities, dining options, and guest stays.</li>
              <li>Maintain standard hospitality compliance and security guidelines.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-2">
              3. Data Security Safeguards
            </h2>
            <p>
              We implement industry-standard physical, electronic, and administrative safeguards to protect your information against unauthorized access or disclosure. We never sell, lease, or monetize your contact information with external marketing entities.
            </p>
          </div>

          <div id="terms" className="pt-4 border-t border-gray-100">
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-2">
              4. Booking & Cancellation Terms
            </h2>
            <p>
              Direct room reservations do not require upfront card debit upon initial inquiry. Check-in commences at 2:00 PM and check-out is by 12:00 PM. Notice of date alterations or cancellations should be communicated to our concierge at least 48 hours in advance.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-2">
              5. Contact Us Regarding Your Privacy
            </h2>
            <p>
              If you have any questions or wish to review stored reservation details, please contact:
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl text-xs space-y-1 text-gray-800 border border-gray-200/80">
              <p><strong>Hotel Liyera Guest Relations</strong></p>
              <p>120 Ocean View Boulevard, Coastal Sanctuary Suite 500</p>
              <p>Phone: +1 (800) 555-0199</p>
              <p>Email: <a href="mailto:info@hotelliyera.com" className="text-yellow-600 underline">info@hotelliyera.com</a></p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== UNIFIED FOOTER ===== */}
      <Footer />
    </main>
  );
}
