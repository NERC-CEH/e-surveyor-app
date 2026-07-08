import { z } from 'zod';

const resultsSchema = z.object({}).passthrough();

const habitatHierarchyItemSchema = z.object({
  ukHabLevel: z.number().optional(),
  code: z.string().optional(),
  name: z.string().optional(),
  definition: z.string().optional(),
  inclusions: z.string().nullable().optional(),
  exclusions: z.string().nullable().optional(),
  confidence: z.number().nullable().optional(),
});

const ukhabPredictionSchema = z.object({
  predictedLevel: z.number(),
  confidence: z.number(),
  code: z.string(),
  name: z.string(),
  definition: z.string().optional(),
  rank: z.number().optional(),
  primaryHabitatHierarchy: z.array(habitatHierarchyItemSchema).optional(),
  secondaryCodes: z.array(z.string()).optional(),
  ukhabVersion: z.string().optional(),
});

export const habitatInferenceResponseSchema = z.object({
  images: z
    .array(
      z.object({
        filename: z.string(),
        sourceType: z.enum(['url']),
        sourceUrl: z.string().url(),
        results: resultsSchema,
        inferenceTimeMs: z.number(),
        gradcamImage: z.string().nullable(),
      })
    )
    .optional(),
  combinedResults: z.object({ ukhab: z.array(ukhabPredictionSchema) }),
  combinedPrediction: ukhabPredictionSchema.optional(),
  timestamp: z.string().optional(),
  inferenceTimeMs: z.number().optional(),
  modelVersion: z.string().optional(),
  userMessage: z.string().optional(),
  requestMetadata: z
    .object({
      imageCount: z.number().optional(),
      uploadedImageCount: z.number().optional(),
      imageUrlCount: z.number().optional(),
      habitatClassifications: z.string().optional(),
      dateTime: z.string().nullable().optional(),
      sensorType: z.string().optional(),
      topN: z.number().optional(),
      latitude: z.number().nullable().optional(),
      longitude: z.number().nullable().optional(),
      speciesList: z.array(z.string()).nullable().optional(),
      modelVersion: z.string().optional(),
      ukhabPredictedLevel: z.number().optional(),
      ukhabSecondaryCodes: z.boolean().optional(),
    })
    .optional(),
});

export type HabitatInferenceResponse = z.infer<
  typeof habitatInferenceResponseSchema
>;
