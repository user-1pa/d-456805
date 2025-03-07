// supabase/functions/send-newsletter/email-template.ts
export interface EmailTemplateProps {
  firstName?: string;
  previewText: string;
  mainHeading: string;
  heroImageUrl: string;
  contentBlocks: {
    heading: string;
    text: string;
    ctaText?: string;
    ctaUrl?: string;
    imageUrl?: string;
  }[];
  footerLinks: {
    text: string;
    url: string;
  }[];
  unsubscribeUrl: string;
}

export const generateEmailTemplate = ({
  firstName = 'Fitness Enthusiast',
  previewText,
  mainHeading,
  heroImageUrl,
  contentBlocks,
  footerLinks,
  unsubscribeUrl
}: EmailTemplateProps): string => {
  const contentBlocksHTML = contentBlocks.map(block => `
    <tr>
      <td style="padding: 20px 30px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="color: #153643; font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; padding-bottom: 10px;">
              ${block.heading}
            </td>
          </tr>
          <tr>
            <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding: 0 0 20px 0;">
              ${block.text}
            </td>
          </tr>
          ${block.imageUrl ? `
            <tr>
              <td style="padding: 0 0 20px 0;">
                <img src="${block.imageUrl}" alt="" width="500" style="height: auto; display: block; margin: 0 auto; border-radius: 4px;" />
              </td>
            </tr>
          ` : ''}
          ${block.ctaText && block.ctaUrl ? `
            <tr>
              <td align="center" style="padding: 15px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="background: #000000; border-radius: 4px; text-align: center;">
                      <a href="${block.ctaUrl}" target="_blank" style="background: #000000; border: 15px solid #000000; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; line-height: 1; text-decoration: none; display: inline-block; border-radius: 4px; color: #ffffff;">
                        ${block.ctaText}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          ` : ''}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 30px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top: 1px solid #dddddd;">
          <tr>
            <td style="font-size: 0; line-height: 0; height: 20px;">&nbsp;</td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  const footerLinksHTML = footerLinks.map(link => 
    `<a href="${link.url}" style="color: #ffffff; text-decoration: underline; margin: 0 10px;">${link.text}</a>`
  ).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${mainHeading}</title>
  <meta name="description" content="${previewText}">
  <!--[if mso]>
  <style>
    * { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
  <!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet" type="text/css">
  <!--<![endif]-->
  <style>
    body, html {
      margin: 0 auto !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    * {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    div[style*="margin: 16px 0"] { margin: 0 !important; }
    table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
    table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; }
    img { -ms-interpolation-mode: bicubic; }
    a { text-decoration: none; }
    *[x-apple-data-detectors], .unstyle-auto-detected-links *, .aBn {
      border-bottom: 0 !important;
      cursor: default !important;
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }
    @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
      u ~ div .email-container { min-width: 320px !important; }
    }
    @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
      u ~ div .email-container { min-width: 375px !important; }
    }
    @media only screen and (min-device-width: 414px) {
      u ~ div .email-container { min-width: 414px !important; }
    }
  </style>
</head>
<body width="100%" style="margin: 0; padding: 0 !important; background-color: #f5f5f5;">
  <center style="width: 100%; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px 0;" class="email-container">
      <!-- Preview Text -->
      <div style="display: none; max-height: 0px; overflow: hidden;">
        ${previewText}
      </div>
      
      <!-- Email Header -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 auto; background-color: #000000; border-radius: 8px 8px 0 0;">
        <tr>
          <td style="padding: 20px 30px; text-align: center;">
            <img src="https://your-domain.com/logo.png" width="200" height="auto" alt="4ortune Fitness" style="height: auto; display: block; margin: 0 auto;">
          </td>
        </tr>
      </table>
      
      <!-- Email Body -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 auto; background-color: #ffffff;">
        <!-- Hero Section -->
        <tr>
          <td style="padding: 0;">
            <img src="${heroImageUrl}" width="600" height="auto" alt="" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto;">
          </td>
        </tr>
        <tr>
          <td style="padding: 30px 30px 20px 30px; text-align: center;">
            <h1 style="margin: 0; font-family: Arial, sans-serif; font-size: 28px; line-height: 36px; color: #333333; font-weight: bold;">Hi ${firstName},</h1>
            <h2 style="margin: 10px 0 0 0; font-family: Arial, sans-serif; font-size: 24px; line-height: 30px; color: #333333; font-weight: bold;">${mainHeading}</h2>
          </td>
        </tr>
        
        <!-- Content Blocks -->
        ${contentBlocksHTML}
        
        <!-- Email Footer -->
        <tr>
          <td style="padding: 30px; background-color: #000000; border-radius: 0 0 8px 8px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="padding: 0 0 20px 0; text-align: center;">
                  <!-- Social Media Icons -->
                  <a href="https://www.facebook.com" target="_blank" style="display: inline-block; margin: 0 5px;">
                    <img src="https://your-domain.com/facebook-icon.png" alt="Facebook" width="32" height="32">
                  </a>
                  <a href="https://www.instagram.com" target="_blank" style="display: inline-block; margin: 0 5px;">
                    <img src="https://your-domain.com/instagram-icon.png" alt="Instagram" width="32" height="32">
                  </a>
                  <a href="https://www.twitter.com" target="_blank" style="display: inline-block; margin: 0 5px;">
                    <img src="https://your-domain.com/twitter-icon.png" alt="Twitter" width="32" height="32">
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 0 20px 0; text-align: center; color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; line-height: 20px;">
                  <p style="margin: 0 0 10px 0;">4ortune Fitness, Inc.</p>
                  <p style="margin: 0 0 10px 0;">123 Fitness Street, Workout City, WO 12345</p>
                  <p style="margin: 0;">&copy; 2025 4ortune Fitness. All rights reserved.</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 0 20px 0; text-align: center; color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; line-height: 20px;">
                  ${footerLinksHTML}
                </td>
              </tr>
              <tr>
                <td style="text-align: center; color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; line-height: 20px;">
                  <p style="margin: 0;">
                    You received this email because you're subscribed to 4ortune Fitness newsletters. 
                    <a href="${unsubscribeUrl}" style="color: #ffffff; text-decoration: underline;">Unsubscribe</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </center>
</body>
</html>
  `;
};
