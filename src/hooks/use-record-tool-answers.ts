'use client'

import { useEffect } from "react";
import { recordToolAnswers, type ToolAnswers } from "@/lib/visitorAnswers";

/**
 * Saves a tool's current answers for the LINE lead form (this tab only).
 * Pass null until the visitor has reached a result; earlier answers are kept.
 */
export function useRecordToolAnswers(tool: string, answers: ToolAnswers | null) {
  const json = answers ? JSON.stringify(answers) : null;
  useEffect(() => {
    if (json) recordToolAnswers(tool, JSON.parse(json));
  }, [tool, json]);
}
