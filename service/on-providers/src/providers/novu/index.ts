import { BurstSmsProvider } from '@novu/burst-sms';
import { ClickatellSmsProvider } from '@novu/clickatell';
import { FortySixElksSmsProvider } from '@novu/forty-six-elks';
import { InfobipEmailProvider, InfobipSmsProvider } from '@novu/infobip';
import { KannelSmsProvider } from '@novu/kannel';
import { MaqsamSmsProvider } from '@novu/maqsam';
import { NexmoSmsProvider } from '@novu/nexmo';
import { NovuSmsProvider } from './novu-sms.provider';
import { PlivoSmsProvider } from '@novu/plivo';
import { Sms77SmsProvider } from '@novu/sms77';
import {
  EmailProviderIdEnum,
  emailProviders,
  SmsProviderIdEnum,
  smsProviders,
} from '@novu/shared';
import { SNSSmsProvider } from '@novu/sns';
import { TelnyxSmsProvider } from '@novu/telnyx';
import { SmsCentralSmsProvider } from '@novu/sms-central';
import { AfricasTalkingSmsProvider } from '@novu/africas-talking';
import { SendchampSmsProvider } from '@novu/sendchamp';
import { MailgunEmailProvider } from '@novu/mailgun';
import { NovuEmailProvider } from './novu-email.provider';
import { MandrillProvider } from '@novu/mandrill';
import { PostmarkEmailProvider } from '@novu/postmark';
import { SendinblueEmailProvider } from '@novu/sendinblue';
import { NetCoreProvider } from '@novu/netcore';
import { MailersendEmailProvider } from '@novu/mailersend';
import { Outlook365Provider } from '@novu/outlook365';
import { ResendEmailProvider } from '@novu/resend';
import { SparkPostEmailProvider } from '@novu/sparkpost';

// From https://github.com/novuhq/novu/blob/main/libs/shared/src/consts/providers/channels/sms.ts
export const NOVU_SMS_PROVIDERS = [
  new NovuSmsProvider(
    (c) => new NexmoSmsProvider(c),
    smsProviders.find((x) => x.id === SmsProviderIdEnum.Nexmo),
  ),
  new NovuSmsProvider(
    (c) => new PlivoSmsProvider(c),
    smsProviders.find((x) => x.id === SmsProviderIdEnum.Plivo),
  ),
  new NovuSmsProvider(
    (c) => new Sms77SmsProvider(c),
    smsProviders.find((x) => x.id === SmsProviderIdEnum.Sms77),
  ),
  new NovuSmsProvider(
    (c) => new SNSSmsProvider(c),
    smsProviders.find((x) => x.id === SmsProviderIdEnum.SNS),
  ),
  new NovuSmsProvider(
    (c) => new TelnyxSmsProvider(c),
    smsProviders.find((x) => x.id === SmsProviderIdEnum.Telnyx),
  ),
  /*
  new NovuSmsProvider(
    (c) => new GupshupSmsProvider(c),
    smsProviders.find((x) => x.id === SmsProviderIdEnum.Gupshup),
  ),
  /*
  new NovuSmsProvider(
    (c) => new FiretextSmsProvider(c),
    smsProviders.find((x) => x.id === SmsProviderIdEnum.Firetext),
  ),
  */
  new NovuSmsProvider(
    (c) => new InfobipSmsProvider(c),
    smsProviders.find((x) => x.id === SmsProviderIdEnum.Infobip),
  ),
  new NovuSmsProvider(
    (c) => new BurstSmsProvider(c),
    smsProviders.find((x) => x.id === SmsProviderIdEnum.BurstSms),
  ),
  new NovuSmsProvider(
    (c) => new ClickatellSmsProvider(c),
    smsProviders.find((x) => x.id === SmsProviderIdEnum.Clickatell),
  ),
  new NovuSmsProvider(
    (c) => new FortySixElksSmsProvider(c),
    smsProviders.find((x) => x.id === SmsProviderIdEnum.FortySixElks),
  ),
  new NovuSmsProvider(
    (c) => new KannelSmsProvider(c),
    smsProviders.find((x) => x.id === SmsProviderIdEnum.Kannel),
  ),
  new NovuSmsProvider(
    (c) => new MaqsamSmsProvider(c),
    smsProviders.find((x) => x.id === SmsProviderIdEnum.Maqsam),
  ),
  new NovuSmsProvider(
    (c) => new SmsCentralSmsProvider(c),
    smsProviders.find((x) => x.id === SmsProviderIdEnum.SmsCentral),
  ),
  new NovuSmsProvider(
    (c) => new AfricasTalkingSmsProvider(c),
    smsProviders.find((x) => x.id === SmsProviderIdEnum.AfricasTalking),
  ),
  new NovuSmsProvider(
    (c) => new SendchampSmsProvider(c),
    smsProviders.find((x) => x.id === SmsProviderIdEnum.Sendchamp),
  ),
];

// From https://github.com/novuhq/novu/blob/main/libs/shared/src/consts/providers/channels/sms.ts
export const NOVU_EMAIL_PROVIDERS = [
  new NovuEmailProvider(
    (c) => new MailgunEmailProvider(c),
    emailProviders.find((x) => x.id === EmailProviderIdEnum.Mailgun),
  ),
  new NovuEmailProvider(
    (c) => new MandrillProvider(c),
    emailProviders.find((x) => x.id === EmailProviderIdEnum.Mandrill),
  ),
  new NovuEmailProvider(
    (c) => new PostmarkEmailProvider(c),
    emailProviders.find((x) => x.id === EmailProviderIdEnum.Postmark),
  ),
  new NovuEmailProvider(
    (c) => new SendinblueEmailProvider(c),
    emailProviders.find((x) => x.id === EmailProviderIdEnum.Sendinblue),
  ),
  new NovuEmailProvider(
    (c) => new NetCoreProvider(c),
    emailProviders.find((x) => x.id === EmailProviderIdEnum.NetCore),
  ),
  new NovuEmailProvider(
    (c) => new MailersendEmailProvider(c),
    emailProviders.find((x) => x.id === EmailProviderIdEnum.MailerSend),
  ),
  new NovuEmailProvider(
    (c) => new Outlook365Provider(c),
    emailProviders.find((x) => x.id === EmailProviderIdEnum.Outlook365),
  ),
  new NovuEmailProvider(
    (c) => new InfobipEmailProvider(c),
    emailProviders.find((x) => x.id === EmailProviderIdEnum.Infobip),
  ),
  new NovuEmailProvider(
    (c) => new ResendEmailProvider(c),
    emailProviders.find((x) => x.id === EmailProviderIdEnum.Resend),
  ),
  new NovuEmailProvider(
    (c) => new SparkPostEmailProvider(c),
    emailProviders.find((x) => x.id === EmailProviderIdEnum.SparkPost),
  ),
];
