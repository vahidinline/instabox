export default function Privacy() {
  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p>
        <strong>Effective Date:</strong> April 30, 2025
      </p>

      <p className="mt-4">
        This Privacy Policy describes how Instabox (“we”, “us”, or “our”)
        collects, uses, and shares information when you use our application,
        which integrates with Instagram APIs.
      </p>

      <h2 className="text-xl font-semibold mt-6">1. Information We Collect</h2>
      <ul className="list-disc list-inside ml-4">
        <li>Instagram account ID</li>
        <li>Basic profile information</li>
        <li>Message and comment permissions (if granted)</li>
        <li>Authorization token/code</li>
      </ul>
      <p>We do not collect passwords or sensitive personal data.</p>

      <h2 className="text-xl font-semibold mt-6">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc list-inside ml-4">
        <li>Authenticate your Instagram account</li>
        <li>Enable automation and response features as per your settings</li>
        <li>Improve our services and provide support</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">3. Data Storage</h2>
      <p>
        Data such as access tokens or authorization codes may be stored
        temporarily in your browser’s local storage for session continuity. No
        data is shared with third parties or used for advertising.
      </p>

      <h2 className="text-xl font-semibold mt-6">4. Data Sharing</h2>
      <p>
        We do not share your Instagram data with any third parties. Your data is
        used only within the Instabox application.
      </p>

      <h2 className="text-xl font-semibold mt-6">5. User Control</h2>
      <p>
        You can revoke our access at any time through your Instagram settings.
        If you wish to delete your data from our system, please contact us.
      </p>

      <h2 className="text-xl font-semibold mt-6">6. Contact</h2>
      <p>
        If you have questions or concerns about this privacy policy, you may
        contact us at: <br />
        <a
          href="mailto:support@instabox.app"
          className="text-blue-600 underline">
          support@instabox.app
        </a>
      </p>

      <p className="mt-6 italic">
        This policy is updated in accordance with Meta Platform Policies and
        applicable laws.
      </p>
    </div>
  );
}
