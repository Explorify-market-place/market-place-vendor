import { DynamoDBUser } from "./dynamodb";

export interface VendorCompletionStatus {
  isComplete: boolean;
  isVerified: boolean;
  hasOrgDetails: boolean;
  hasBankDetails: boolean;
  missingFields: string[];
}

/**
 * Check if vendor has completed all required information to post trips
 * Requirements:
 * 1. Must be verified by admin (vendorVerified = true)
 * 2. Must have organization details (name, address, phone)
 * 3. Must have bank details for payouts
 */
export function checkVendorCompletion(
  user: DynamoDBUser | null | undefined
): VendorCompletionStatus {
  const status: VendorCompletionStatus = {
    isComplete: false,
    isVerified: false,
    hasOrgDetails: false,
    hasBankDetails: false,
    missingFields: [],
  };

  if (!user || user.role !== "vendor") {
    return status;
  }

  // Check verification status
  status.isVerified = user.vendorVerified === true;
  if (!status.isVerified) {
    status.missingFields.push("Admin verification pending");
  }

  // Check organization details
  const hasOrgName = !!user.vendorInfo?.organizationName?.trim();
  const hasAddress = !!user.vendorInfo?.address?.trim();
  const hasPhone = !!user.vendorInfo?.phoneNumber?.trim();

  status.hasOrgDetails = hasOrgName && hasAddress && hasPhone;
  if (!hasOrgName) status.missingFields.push("Organization name");
  if (!hasAddress) status.missingFields.push("Business address");
  if (!hasPhone) status.missingFields.push("Phone number");

  // Check bank details (at least one payout method)
  const bankDetails = user.vendorInfo?.bankDetails;
  const hasBankAccount = !!(
    bankDetails?.accountNumber?.trim() &&
    bankDetails?.ifscCode?.trim() &&
    bankDetails?.accountHolderName?.trim()
  );
  const hasUPI = !!bankDetails?.upiId?.trim();

  status.hasBankDetails = hasBankAccount || hasUPI;
  if (!status.hasBankDetails) {
    status.missingFields.push("Bank account or UPI details");
  }

  // Complete if verified + has org details + has bank details
  status.isComplete =
    status.isVerified && status.hasOrgDetails && status.hasBankDetails;

  return status;
}

/**
 * Get a user-friendly message about what's needed to complete vendor profile
 */
export function getVendorCompletionMessage(
  status: VendorCompletionStatus
): string {
  if (status.isComplete) {
    return "Your vendor profile is complete!";
  }

  if (status.missingFields.length === 0) {
    return "Complete your profile to start posting trips";
  }

  const fields = status.missingFields.join(", ");
  return `Complete your profile to post trips. Missing: ${fields}`;
}
