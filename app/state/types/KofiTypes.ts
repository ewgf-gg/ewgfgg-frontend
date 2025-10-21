// Types for Ko-fi webhook integration

export interface IncomingKofiDonation {
  verification_token: string;
  message_id: string;
  timestamp: string;
  type: string;
  is_public: boolean;
  from_name: string;
  message: string;
  amount: string;
  url: string;
  email: string;
  currency: string;
  is_subscription_payment: boolean;
  is_first_subscription_payment: boolean;
  kofi_transaction_id: string;
  tier_name: string | null;
  discord_username: string | null;
  discord_userid: string | null;
}

export interface KofiWebhookPayload {
  data: string; // JSON string containing IncomingKofiDonation
}
