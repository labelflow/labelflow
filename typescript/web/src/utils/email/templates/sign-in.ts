import mjml2html from "mjml";
import { stringify } from "query-string";
import { theme } from "../../../theme";

// To view this email, go to this page:
// http://localhost:3000/api/email/view?type=signin&url=http://google.com&origin=http://localhost:3000&email=test@labelflow.ai
// Or worse
// http://localhost:3000/api/email/view?email=test%40labelflow.ai&origin=http%3A%2F%2Flocalhost%3A3000&type=signin&url=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Femail%2Fview%3Ftype%3Dactivation%26url%3Dhttp%3A%2F%2Fgoogle.com%26origin%3Dhttp%3A%2F%2Flocalhost%3A3000%26email%3Dtest%40labelflow.ai

export const generateHtml = (props: {
  url: string;
  origin: string;
  type: string;
}) => {
  const { url, origin } = props;
  const viewOnlineLink = `${origin}/api/email/view?${stringify(props)}`;
  return mjml2html(
    `
    <mjml owa="desktop" version="4.3.0">
    <mj-head>
      <mj-font href="https://fonts.googleapis.com/css?family=Montserrat" name="Montserrat"></mj-font>
      <mj-font href="https://fonts.googleapis.com/css?family=Raleway" name="Raleway"></mj-font>
      <mj-font href="https://fonts.googleapis.com/css?family=Open Sans" name="Open Sans"></mj-font>
      <mj-preview></mj-preview>
    </mj-head>
    <mj-body background-color="${theme.colors.gray["100"]}" color="${theme.colors.gray["800"]}" font-family="Inter, Open Sans, Helvetica, Arial, sans-serif">
      <mj-section background-repeat="repeat" background-size="auto" padding-bottom="0px" padding-top="0px" padding="20px 0px 20px 0px" text-align="center" vertical-align="top">
        <mj-column>
          <mj-text align="left" color="${theme.colors.gray["800"]}" font-familyInter,="Inter, Open Sans, Helvetica, Arial, sans-serif" font-size="11px" line-height="22px" padding-bottom="0px" padding-top="0px" padding="0px 0px 0px 25px">
            <p style="text-align: center; margin: 10px 0;">LabelFlow sign in&nbsp;| <a target="_blank" rel="noopener noreferrer" href="${viewOnlineLink}"><span style="color:${theme.colors.gray["800"]}; text-decoration: underline"> View online version</span></a></p>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff" background-repeat="repeat" padding-bottom="0px" padding-left="0px" padding-right="0px" padding-top="0px" padding="20px 0" text-align="center" vertical-align="top">
        <mj-column>
          <mj-divider border-color="${theme.colors.brand["500"]}" border-style="solid" border-width="7px" padding-bottom="40px" padding-left="0px" padding-right="0px" padding-top="0px" padding="10px 25px" width="100%"></mj-divider>
          <mj-image align="center" alt="" border="none" href="${origin}" type="Unit" padding-bottom="30px" padding-top="0px" padding="10px 25px" src="${origin}/static/img/logo-email.png" target="_blank" title="" height="auto" width="300px"></mj-image>
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff" background-repeat="repeat" background-size="auto" padding-bottom="0px" padding-top="0px" padding="20px 0" text-align="center" vertical-align="top">
        <mj-column>
          <mj-image align="center" alt="" border="none" height="auto" type="Unit" padding-bottom="0px" padding-left="50px" padding-right="50px" padding-top="40px" padding="10px 25px" src="${origin}/static/graphics/png/sign-in.png" target="_blank" title="" width="200px"></mj-image>
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff" background-repeat="repeat" background-size="auto" padding-bottom="70px" padding-top="30px" padding="20px 0px 20px 0px" text-align="center" vertical-align="top">
        <mj-column>
          <mj-text align="left" color="${theme.colors.gray["800"]}" font-familyInter,="Inter, Open Sans, Helvetica, Arial, sans-serif" font-size="15px" line-height="22px" padding-bottom="0px" padding-left="50px" padding-right="50px" padding-top="0px" padding="0px 25px 0px 25px">
            <h1 style="text-align:center; color: ${theme.colors.gray["900"]}; line-height:32px">Use this link to sign in</h1>
          </mj-text>
          <mj-text align="left" color="${theme.colors.gray["800"]}" font-familyInter,="Inter, Open Sans, Helvetica, Arial, sans-serif" font-size="15px" line-height="22px" padding-bottom="0px" padding-left="50px" padding-right="50px" padding-top="0px" padding="0px 25px 0px 25px">
            <p style="margin: 10px 0; text-align: center;">You requested a magic link to sign in on <a href="${origin}">labelflow.ai</a>, and here it is!</br> Note that this link can only be used once.<br /></p>
          </mj-text>
          <mj-button align="center" background-color="${theme.colors.brand["500"]}" border-radius="100px" border="none" color="#ffffff" font-familyInter,="Inter, Open Sans, Helvetica, Arial, sans-serif" font-size="15px" font-weight="normal" href="${url}" inner-padding="15px 25px 15px 25px" padding-bottom="20px" padding-top="20px" padding="10px 25px" text-decoration="none" text-transform="none" vertical-align="middle"><b style="font-weight:700"><b style="font-weight:700">SIGN IN</b></b></mj-button>
          <mj-text align="left" color="${theme.colors.gray["800"]}" font-familyInter,="Inter, Open Sans, Helvetica, Arial, sans-serif" font-size="15px" line-height="22px" padding-bottom="0px" padding-left="50px" padding-right="50px" padding-top="0px" padding="0px 25px 0px 25px">
            <p style="margin: 10px 0; text-align: center;">If the link doesn&rsquo;t work, copy this URL into your browser:</br> <a target="_blank" rel="noopener noreferrer" href="${url}" style="color:${theme.colors.brand["500"]}">${url}</a></p>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-repeat="repeat" background-size="auto" padding-bottom="0px" padding-top="20px" padding="20px 0px 20px 0px" text-align="center" vertical-align="top">
        <mj-column>
          <mj-social align="center" border-radius="6px" font-family="Ubuntu, Helvetica, Arial, sans-serif" font-size="13px" icon-size="30" line-height="22px" mode="horizontal" padding-bottom="0px" padding="10px 25px" text-decoration="none" text-mode="true">
            <mj-social-element background-color="${theme.colors.brand["500"]}" href="https://www.facebook.com/Labelflow" name="facebook-noshare" src="http://www.mailjet.com/saas-templates-creator/static/img/facebook_white.png"></mj-social-element>
            <mj-social-element background-color="${theme.colors.brand["500"]}" href="https://twitter.com/LabelflowAI" name="twitter-noshare" src="http://www.mailjet.com/saas-templates-creator/static/img/twitter_white.png"></mj-social-element>
            <mj-social-element background-color="${theme.colors.brand["500"]}" href="https://www.linkedin.com/company/labelflow/" name="linkedin-noshare" src="http://www.mailjet.com/saas-templates-creator/static/img/linkedin_white.png"></mj-social-element>
          </mj-social>
          <mj-text align="center" color="${theme.colors.gray["800"]}" font-familyInter,="Inter, Open Sans, Helvetica, Arial, sans-serif" font-size="11px" line-height="22px" padding-bottom="0px" padding-top="0px" padding="0px 20px 0px 20px">
            <!-- <p style="margin: 10px 0;"><a target="_blank" rel="noopener noreferrer" style="color:${theme.colors.brand["500"]}" href="#"><span style="color:${theme.colors.brand["500"]}">Page 1</span></a><span style="color:${theme.colors.gray["800"]}">&nbsp; &nbsp;|&nbsp; &nbsp;</span><a target="_blank" rel="noopener noreferrer" style="color:${theme.colors.brand["500"]}" href="#"><span style="color:${theme.colors.brand["500"]}">Page 2</span></a><span style="color:${theme.colors.gray["800"]}">&nbsp; &nbsp;|&nbsp; &nbsp;</span><a target="_blank" rel="noopener noreferrer" style="color:${theme.colors.brand["500"]}" href="#"><span style="color:${theme.colors.brand["500"]}">Page 3</span></a></p> -->
            <!-- <p style="margin: 10px 0;">C<a target="_blank" rel="noopener noreferrer" style="color:inherit; text-decoration:none" href="[[UNSUB_LINK_EN]]">lick <span style="color:${theme.colors.brand["500"]}"><u>here</u></span> to unsubscribe</a>.<br /><span style="font-size:10px">Created by&nbsp;</span><a target="_blank" rel="noopener noreferrer" style="font-size:10px; color:inherit; text-decoration: none" href="https://www.mailjet.com/?utm_source=saas_email_templates&amp;utm_medium=logo_footer_email&amp;utm_campaign=account_activation"><span style="color:${theme.colors.brand["500"]}"><u>Mailjet</u></span></a></p> -->
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`,
    {}
  ).html;
};
