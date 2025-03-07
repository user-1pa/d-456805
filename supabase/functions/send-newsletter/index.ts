// supabase/functions/send-newsletter/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { generateEmailTemplate, EmailTemplateProps } from './email-template.ts';

// This would be your email service integration
// Replace with your actual email sending service API
interface EmailService {
  sendBulkEmails(emails: EmailMessage[]): Promise<any>;
}

interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  personalizations?: {
    name?: string;
    email: string;
  }[];
}

class MockEmailService implements EmailService {
  async sendBulkEmails(emails: EmailMessage[]): Promise<any> {
    console.log(`Mock sending ${emails.length} emails`);
    // In a real implementation, this would call your email provider's API
    return { success: true, count: emails.length };
  }
}

// For production, replace this with your actual email service integration
// Example: SendGrid, Mailchimp, AWS SES, etc.
const emailService = new MockEmailService();

// Security headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Initialize Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    // Validate the request has proper authorization
    // This function would check if the request has a valid admin JWT or API key
    const authorized = await validateAuthorization(req, supabaseAdmin);
    if (!authorized) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Parse the request body
    const { newsletterId, subject, targetSegment } = await req.json();
    
    if (!newsletterId || !subject) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Fetch the newsletter template
    const { data: newsletter, error: newsletterError } = await supabaseAdmin
      .from('newsletter_templates')
      .select('*')
      .eq('id', newsletterId)
      .single();
      
    if (newsletterError || !newsletter) {
      return new Response(JSON.stringify({ error: 'Newsletter template not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Build query to fetch subscribers based on target segment
    let query = supabaseAdmin
      .from('newsletter_subscriptions')
      .select('*')
      .eq('is_active', true);
    
    // Apply segmentation filters if provided
    if (targetSegment) {
      if (targetSegment.preferences) {
        for (const [key, value] of Object.entries(targetSegment.preferences)) {
          if (value === true) {
            query = query.filter('preferences', 'cs', JSON.stringify({ [key]: true }));
          }
        }
      }
    }
    
    // Fetch subscribers
    const { data: subscribers, error: subscribersError } = await query;
    
    if (subscribersError) {
      return new Response(JSON.stringify({ error: 'Failed to fetch subscribers' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ message: 'No subscribers matching the target segment' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Prepare email content from the template
    const templateProps: EmailTemplateProps = {
      previewText: newsletter.preview_text,
      mainHeading: newsletter.main_heading,
      heroImageUrl: newsletter.hero_image_url,
      contentBlocks: newsletter.content_blocks,
      footerLinks: newsletter.footer_links,
      unsubscribeUrl: newsletter.unsubscribe_url,
    };
    
    // Prepare batch of emails to send
    const emailMessages: EmailMessage[] = subscribers.map(subscriber => {
      // Create personalized template for each subscriber
      const personalized = {
        ...templateProps,
        firstName: subscriber.first_name || undefined
      };
      
      const html = generateEmailTemplate(personalized);
      
      return {
        to: subscriber.email,
        subject: subject,
        html: html,
        personalizations: [
          {
            name: subscriber.first_name || undefined,
            email: subscriber.email
          }
        ]
      };
    });
    
    // Send emails
    const sendResult = await emailService.sendBulkEmails(emailMessages);
    
    // Log the campaign in the database
    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from('newsletter_campaigns')
      .insert([{
        template_id: newsletterId,
        subject: subject,
        target_segment: targetSegment || null,
        sent_count: emailMessages.length,
        status: 'completed',
        sent_at: new Date(),
      }])
      .select();
      
    if (campaignError) {
      console.error('Failed to log campaign:', campaignError);
    }
    
    // Return success response
    return new Response(JSON.stringify({
      success: true,
      message: `Successfully sent newsletter to ${emailMessages.length} subscribers`,
      campaign: campaign?.[0] || null
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error sending newsletter:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to send newsletter',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to validate request authorization
async function validateAuthorization(req: Request, supabase: any): Promise<boolean> {
  // Get the authorization header
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    return false;
  }
  
  // Check if it's a service key or JWT
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    // Validate JWT token
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return false;
    }
    
    // Check if the user has admin role
    // This would depend on your authorization setup
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .single();
      
    return userRoles?.role === 'admin';
