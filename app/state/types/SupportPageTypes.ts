// TypeScript types matching the backend DTOs

export interface MonthlyProgressDto {
  currentAmount: number;
  goalAmount: number;
  donationCount: number;
  currency: string;
  percentage: number;
}

export interface DonationDTO {
  fromName: string;
  amount: number;
  currency: string;
  message: string | null;
  isPublic: boolean;
  timestamp: string; // ISO 8601 string
}

export interface DonorPageResponse {
  monthlyProgress: MonthlyProgressDto;
  topDonations: DonationDTO[];
  recentDonations: DonationDTO[];
}
