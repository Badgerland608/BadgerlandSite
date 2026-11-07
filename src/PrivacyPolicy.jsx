
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold text-purple-900 mb-4">
        Privacy Policy
      </h1>

      <p className="text-sm text-gray-500 mb-8">
        Effective Date: November 6, 2026
      </p>

      <p className="mb-6">
        Badgerland Laundry LLC ("Badgerland Laundry," "we," "us," or "our")
        respects your privacy. This Privacy Policy explains how we collect,
        use, and share information when you visit our website or use our
        laundry pickup and delivery services.
      </p>

      <h2 className="text-xl font-bold text-purple-900 mt-8 mb-3">
        1. Information We Collect
      </h2>
      <p className="mb-3">
        Depending on how you interact with us, we may collect:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Name and contact information, such as email address and phone number.</li>
        <li>Pickup and delivery addresses and service preferences.</li>
        <li>Order details, laundry instructions, and service history.</li>
        <li>Business name, contact details, and information submitted through commercial inquiry forms.</li>
        <li>Payment and transaction information related to purchases.</li>
        <li>Information you voluntarily provide when contacting us.</li>
      </ul>

      <h2 className="text-xl font-bold text-purple-900 mt-8 mb-3">
        2. How We Use Your Information
      </h2>
      <p className="mb-3">We may use your information to:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Schedule and provide laundry pickup and delivery services.</li>
        <li>Process orders and payments.</li>
        <li>Respond to questions and customer service requests.</li>
        <li>Send order confirmations, service updates, and relevant communications.</li>
        <li>Manage customer accounts and business inquiries.</li>
        <li>Improve our website, services, and business operations.</li>
        <li>Protect our business, customers, and website from fraud or misuse.</li>
      </ul>

      <h2 className="text-xl font-bold text-purple-900 mt-8 mb-3">
        3. Payment Processing
      </h2>
      <p className="mb-6">
        Payments made through our website may be processed by Stripe.
        Payment information is handled by the payment processor according
        to its own privacy and security practices. We do not intend to store
        full payment card numbers or security codes on our own systems.
        For more information, review Stripe's privacy policy at
        {' '}
        <a
          href="https://stripe.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-700 underline"
        >
          stripe.com/privacy
        </a>.
      </p>

      <h2 className="text-xl font-bold text-purple-900 mt-8 mb-3">
        4. Website and Service Providers
      </h2>
      <p className="mb-6">
        We use third-party service providers to help operate our website
        and services. These may include Supabase for database and
        application services, Stripe for payment processing, and email
        service providers for business and customer communications.
        These providers may process information on our behalf as needed
        to provide their services.
      </p>

      <h2 className="text-xl font-bold text-purple-900 mt-8 mb-3">
        5. Cookies and Website Tracking
      </h2>
      <p className="mb-6">
        Our website may use cookies or similar technologies that are
        necessary for website functionality, account features, or security.
        If we introduce analytics, advertising pixels, or other tracking
        technologies, we will update this policy to explain their use.
      </p>

      <h2 className="text-xl font-bold text-purple-900 mt-8 mb-3">
        6. When We Share Information
      </h2>
      <p className="mb-6">
        We do not sell your personal information. We may share information
        with service providers who help us operate our business, when
        required by law, to protect our rights and safety, or as part of
        a business transaction such as a merger or sale.
      </p>

      <h2 className="text-xl font-bold text-purple-900 mt-8 mb-3">
        7. Data Security and Retention
      </h2>
      <p className="mb-6">
        We use reasonable measures designed to protect the information
        entrusted to us. However, no website or electronic storage system
        can be guaranteed to be completely secure. We retain information
        for as long as reasonably necessary for providing services,
        maintaining business records, resolving disputes, and meeting
        legal obligations.
      </p>

      <h2 className="text-xl font-bold text-purple-900 mt-8 mb-3">
        8. Your Privacy Choices
      </h2>
      <p className="mb-6">
        You may contact us to ask about the personal information we hold
        about you or to request that we correct or delete information,
        subject to applicable legal and business recordkeeping requirements.
        We may need to verify your identity before fulfilling a request.
      </p>

      <h2 className="text-xl font-bold text-purple-900 mt-8 mb-3">
        9. Children's Privacy
      </h2>
      <p className="mb-6">
        Our website and services are not directed to children under 13.
        We do not knowingly collect personal information directly from
        children under 13.
      </p>

      <h2 className="text-xl font-bold text-purple-900 mt-8 mb-3">
        10. Changes to This Policy
      </h2>
      <p className="mb-6">
        We may update this Privacy Policy as our business, website, or
        legal obligations change. Updates will be posted on this page
        with a revised effective date.
      </p>

      <h2 className="text-xl font-bold text-purple-900 mt-8 mb-3">
        11. Contact Us
      </h2>
      <p className="mb-2">
        If you have questions about this Privacy Policy or your personal
        information, contact us:
      </p>
      <p className="mb-1">Badgerland Laundry LLC</p>
      <p className="mb-1">
        Email: <a
          href="mailto:info@badgerlandlaundry.com"
          className="text-purple-700 underline"
        >
          info@badgerlandlaundry.com
        </a>
      </p>
      <p>Website: BadgerlandLaundry.com</p>
    </main>
  );
}
