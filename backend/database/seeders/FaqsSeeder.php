<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FaqsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        $faqs = [

            // Account & Billing 
            ['How can I update my billing information?', 'You can update your billing details from your account settings under the "Billing" tab.',1],
            ['Can I change my subscription plan?', 'Yes, go to your account settings and select "Manage Plan" to upgrade or downgrade anytime.',1],
            ['How do I download my invoices?', 'Invoices are available under the "Billing History" section of your account.',1],
            ['Why was my payment declined?', 'Payments may fail due to insufficient funds or incorrect card info. Try updating your payment method.',1],
            ['Do you offer refunds?', 'Refunds are available under specific conditions. Please contact support for review.',1],

            // Technical Support
            ['Why am I getting a 500 server error?', 'This usually indicates a backend issue. Please report it to support with a screenshot.',2],
            ['My page isn’t loading properly — what can I do?', 'Try clearing your browser cache or disabling extensions. If it persists, contact support.',2],
            ['How do I report a bug?', 'Open a support ticket with details, reproduction steps, and any screenshots.',2],
            ['Why is my upload failing?', 'Check file size limits and ensure your internet connection is stable.',2],
            ['How do I reset the app configuration?', 'Go to "Settings" > "Advanced" > "Reset App Config".',2],

            // Product Usage
            ['How do I create a new project?', 'Click on the “New Project” button on your dashboard and follow the setup wizard.',3],
            ['Can I export my project data?', 'Yes, exports are available in CSV or JSON format under project settings.',3],
            ['How can I share access with my team?', 'Invite team members using their email under the "Collaborators" tab.',3],
            ['Is there a mobile version of the app?', 'Yes, our Android and iOS apps are available on the Play Store and App Store.',3],
            ['How do I enable dark mode?', 'Go to your profile settings and toggle the “Dark Mode” option.',3],

            // Security & Access
            ['I forgot my password — what now?', 'Use the “Forgot Password” link on the login screen to reset your password.',4],
            ['Can I enable two-factor authentication?', 'Yes, under "Security Settings" you can enable 2FA using an authenticator app.',4],
            ['How do I revoke API tokens?', 'Go to your API settings page and click “Revoke” next to any token.',4],
            ['Why was my account locked?', 'Accounts may be locked after too many failed login attempts. Wait 15 minutes or contact support.',4],
            ['Can I restrict login by IP address?', 'Yes, enterprise users can manage IP restrictions under "Access Control".',4],

            // Feedback & Suggestions
            ['How can I submit a feature request?', 'Use the “Feedback” form in your dashboard to submit your ideas.',5],
            ['Do you read user feedback?', 'Absolutely. Every suggestion is reviewed and prioritized based on demand.',5],
            ['Can I vote on upcoming features?', 'Yes, you can vote on our public roadmap at feedback.example.com.',5],
            ['Will you notify me when my suggestion is added?', 'You’ll receive an email once your requested feature is implemented.',5],
            ['Do you offer a beta testing program?', 'Yes, you can join our beta program from the "Settings > Beta Access" section.',5],

            // Integration & API
            ['How do I generate an API key?', 'Go to "Developer Settings" and click “Generate API Key.”',6],
            ['Is there a Postman collection available?', 'Yes, you can download our official Postman collection from the API docs.',6],
            ['Which authentication method does your API use?', 'We use Bearer tokens (JWT) for API authentication.',6],
            ['Can I access sandbox mode for testing?', 'Yes, our sandbox endpoint is available at api-sandbox.example.com.',6],
            ['What rate limits apply to the API?', 'Default limit is 1000 requests per hour per user.',6],
        ];

        foreach ($faqs as [$question, $answer, $categoryId]) {
            Faq::create([
                'question' => $question,
                'answer' => $answer,
                'category_id' => $categoryId,
            ]);
        }
    }
}
