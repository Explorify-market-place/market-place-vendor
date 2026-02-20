"use server";

/**
 * Plan Extraction Server Actions
 *
 * Server-side functions for extracting plan data from PDFs and links.
 * Called directly from React components — no API routes needed.
 */

import { auth } from "@/auth";
import { extractAndCreatePlan } from "@/lib/plan-extraction";
import { moveObject, generateItineraryKey } from "@/lib/s3";
import type { PlanExtractionResult } from "@/types";

/**
 * Process a PDF uploaded to S3 and create a plan from its contents.
 *
 * @param pdfKey - Temporary S3 key of the uploaded PDF
 * @returns Result with planId and name on success, or error message on failure
 */
export async function processPdfExtraction(
  pdfKey: string,
): Promise<PlanExtractionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!pdfKey) {
      return { success: false, error: "PDF key is required" };
    }

    console.log(`Processing PDF - Key: ${pdfKey}`);

    // Extract data from PDF via Lambda and create plan
    const plan = await extractAndCreatePlan({ pdf: pdfKey }, session.user.id, {
      pdfSource: true,
    });

    // Move PDF from temp location to final location using the planId
    await moveObject(pdfKey, generateItineraryKey(plan.planId));

    return { success: true, planId: plan.planId, name: plan.name };
  } catch (error) {
    console.error("Error processing PDF:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Process a URL link and create a plan from its contents.
 *
 * @param link - URL to scrape and extract plan data from
 * @returns Result with planId and name on success, or error message on failure
 */
export async function processLinkExtraction(
  link: string,
): Promise<PlanExtractionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!link) {
      return { success: false, error: "Link is required" };
    }

    // Validate URL format
    try {
      new URL(link);
    } catch {
      return { success: false, error: "Invalid URL format" };
    }

    console.log(`Processing link: ${link}`);

    // Extract data from link via Lambda and create plan
    const plan = await extractAndCreatePlan({ link }, session.user.id, {
      sourceLink: link,
    });

    return { success: true, planId: plan.planId, name: plan.name };
  } catch (error) {
    console.error("Error processing link:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
