import { describe, expect, it } from "vitest";

import { languageRepository } from "../models/languageRepository";

describe("Language Abbreviation Queries", () => {
    const strat = languageRepository.languageAbbreviationStrategies;
  
    it("should return a truthy value when searched by country name (optimized)", async () => {
      const res = await languageRepository.getLanguageAbbreviation("Germany", strat.byCountryNameOptimized);
      expect(res).toBeTruthy();
      
    });
  
    it("should return a truthy value when searched by country name", async () => {
      const res = await languageRepository.getLanguageAbbreviation("Germany", strat.byCountryName);
      expect(res).toBeTruthy();
      
    });
  
    it("should return a truthy value when searched by language name", async () => {
      const res = await languageRepository.getLanguageAbbreviation("spanish", strat.byName);
      expect(res).toBeTruthy();
      
    });
  
    it("should return a truthy value when searched by abbreviation", async () => {
      const res = await languageRepository.getLanguageAbbreviation("DE", strat.byAbbreviation);
      expect(res).toBeTruthy();
      
    });
  
    it("should return a truthy value when searched by emoji", async () => {
      const res = await languageRepository.getLanguageAbbreviation("🇩🇪", strat.byEmoji);
      expect(res).toBeTruthy();
      
    });
    
});

describe("Language Abbreviation Queries (Case Insensitive)", () => {
    const strat = languageRepository.languageAbbreviationStrategies;
  
    it("should return a truthy value when searched by country name (optimized)", async () => {
      const res = await languageRepository.getLanguageAbbreviation("GeRmAnY", strat.byCountryNameOptimized);
      expect(res).toBeTruthy();
    });
  
    it("should return a truthy value when searched by country name", async () => {
      const res = await languageRepository.getLanguageAbbreviation("gErMaNy", strat.byCountryName);
      expect(res).toBeTruthy();
    });
  
    it("should return a truthy value when searched by language name", async () => {
      const res = await languageRepository.getLanguageAbbreviation("SpAnIsH", strat.byName);
      expect(res).toBeTruthy();
    });
  
    it("should return a truthy value when searched by abbreviation", async () => {
      const res = await languageRepository.getLanguageAbbreviation("De", strat.byAbbreviation);
      expect(res).toBeTruthy();
    });
  
    it("should return a truthy value when searched by emoji", async () => {
      const res = await languageRepository.getLanguageAbbreviation("🇩🇪", strat.byEmoji);
      expect(res).toBeTruthy();
    });
  });