import { defineCollection, z } from 'astro:content';

export const collections = {
  cases: defineCollection({
    type: 'content',
    schema: z.object({
      id: z.string(),
      title: z.string(),
      failureType: z.string(),
      failureSubtype: z.string(),
      environment: z.string(),
      agent: z.string(),
      framework: z.string(),
      symptoms: z.array(z.string()),
      initialAiAssumption: z.string(),
      wrongTurn: z.string(),
      retryPattern: z.string(),
      rootCause: z.string(),
      fastestVerification: z.string(),
      fix: z.string(),
      timeWastedMinutes: z.number(),
      keyInsight: z.string(),
      evidenceRefs: z.array(z.string()),
      tags: z.array(z.string()),
      dynamics: z.array(z.string()),
      publishedAt: z.coerce.date(),
    }),
  }),
};
