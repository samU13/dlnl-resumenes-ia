import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rapidApiKey = import.meta.env.VITE_RAPID_API_TRANSLATE_KEY;

export const translateApi = createApi({
  reducerPath: "translateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://deep-translate1.p.rapidapi.com/",
    prepareHeaders: (headers) => {
      headers.set("x-rapidapi-key", rapidApiKey);
      headers.set("x-rapidapi-host", "deep-translate1.p.rapidapi.com");
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    detectLanguage: builder.mutation({
      query: (text) => ({
        url: "language/translate/v2/detect",
        method: "POST",
        body: { q: text },
      }),
    }),
    translateText: builder.mutation({
      query: ({ text, sourceLang }) => ({
        url: "language/translate/v2",
        method: "POST",
        body: {
          q: text,
          source: sourceLang,
          target: "es",
        },
      }),
    }),
  }),
});

export const { useDetectLanguageMutation, useTranslateTextMutation } =
  translateApi;
