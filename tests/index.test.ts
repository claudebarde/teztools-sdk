/*import { describe, expect, test } from "vitest";
import { TezToolsSDK, tokenType } from "../src/index";

let teztools: TezToolsSDK;

describe("Testing api.teztools.io/v1/prices", () => {
  test("Set up the SDK", async () => {
    teztools = new TezToolsSDK();
    await teztools.init();
    expect(teztools.numberOfTokens).toBeGreaterThan(0);
  });

  test("get method", () => {
    const shouldFail = teztools.get("FAKE");
    expect(shouldFail).toBe(null);

    const kusdData = teztools.get("kUSD");
    expect(kusdData).toBeTruthy();
    expect(kusdData).toMatchObject({
      decimals: 18,
      type: "fa1.2",
      tokenAddress: { address: "KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV" }
    });
  });

  test("getByType method", () => {
    const shouldFail = teztools.getByType("test" as any);
    expect(shouldFail).toHaveLength(0);

    const fa2Tokens = teztools.getByType(tokenType.FA2);
    expect(Array.isArray(fa2Tokens)).toBeTruthy();
    expect(fa2Tokens.length).toBeGreaterThan(0);
    expect(fa2Tokens.find(token => token.symbol === "KALAM")).toBeTruthy();
  });

  test("getByAddress method", () => {
    const shouldFail = teztools.getByAddress("test" as any);
    expect(shouldFail).toBe(null);

    const kusdByAddress = teztools.getByAddress(
      "KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV"
    );
    expect(kusdByAddress).toBeTruthy();
    expect(kusdByAddress).toHaveProperty("symbol");
    expect((kusdByAddress as any).symbol).toEqual("kUSD");
  });

  test("getByTag method", () => {
    const shouldFail = teztools.getByTag("test");
    expect(shouldFail).toHaveLength(0);

    const stablecoins = teztools.getByTag("stablecoin");
    expect(Array.isArray(stablecoins)).toBeTruthy();
    expect(stablecoins.find(token => token.symbol === "kUSD")).toBeTruthy();
  });

  test("getTokensWithPriceGreaterThan method", () => {
    const shouldFail = teztools.getTokensWithPriceGreaterThan(1_000_000);
    expect(shouldFail).toHaveLength(0);

    const tokens = teztools.getTokensWithPriceGreaterThan(1);
    expect(Array.isArray(tokens)).toBeTruthy();
    expect(tokens.length).toBeGreaterThan(0);
    tokens.forEach(token => expect(token.currentPrice).toBeGreaterThan(1));
  });

  test("getTokensWithPriceLessThan method", () => {
    const tokens = teztools.getTokensWithPriceLessThan(1);
    expect(Array.isArray(tokens)).toBeTruthy();
    expect(tokens.length).toBeGreaterThan(0);
    tokens.forEach(token => expect(token.currentPrice).toBeLessThan(1));
  });

  test("orderByUsdValueDesc method", () => {
    // no param
    const tokens = teztools.orderByUsdValueDesc();
    expect(Array.isArray(tokens)).toBeTruthy();
    if (tokens[0].usdValue && tokens[1].usdValue) {
      expect(tokens[0].usdValue).toBeGreaterThan(tokens[1].usdValue);
    } else {
      fail("USD values are not available");
    }
    // with wrong params
    try {
      teztools.orderByUsdValueDesc([
        "kUSD",
        "KALAM",
        "tzBTC",
        "PLENTY",
        "FAKE"
      ]);
      fail("orderByUsdValueDesc with wrong params shouldn't work");
    } catch (error) {
      expect((error as any).message).toEqual("Unknown token(s)");
      expect((error as any).list.includes("FAKE")).toBeTruthy();
    }
    // with params
    const tokens_ = teztools.orderByUsdValueDesc([
      "kUSD",
      "KALAM",
      "tzBTC",
      "PLENTY"
    ]);
    expect(Array.isArray(tokens_)).toBeTruthy();
    if (tokens_[0].usdValue && tokens_[1].usdValue) {
      expect(tokens_[0].usdValue).toBeGreaterThan(tokens_[1].usdValue);
    } else {
      fail("USD values are not available");
    }
  });

  test("orderByUsdValueAsc method", () => {
    // no param
    const tokens = teztools.orderByUsdValueAsc();
    expect(Array.isArray(tokens)).toBeTruthy();
    if (tokens[0].usdValue && tokens[1].usdValue) {
      expect(tokens[0].usdValue).toBeLessThan(tokens[1].usdValue);
    } else {
      fail("USD values are not available");
    }
    // with wrong params
    try {
      teztools.orderByUsdValueAsc(["kUSD", "KALAM", "tzBTC", "PLENTY", "FAKE"]);
      fail("orderByUsdValueAsc with wrong params shouldn't work");
    } catch (error) {
      expect((error as any).message).toEqual("Unknown token(s)");
      expect((error as any).list.includes("FAKE")).toBeTruthy();
    }
    // with params
    const tokens_ = teztools.orderByUsdValueAsc([
      "kUSD",
      "KALAM",
      "tzBTC",
      "PLENTY"
    ]);
    expect(Array.isArray(tokens_)).toBeTruthy();
    if (tokens_[0].usdValue && tokens_[1].usdValue) {
      expect(tokens_[0].usdValue).toBeLessThan(tokens_[1].usdValue);
    } else {
      fail("USD values are not available");
    }
  });

  test("getCurrentPrice method", () => {
    // no param
    const currentPrices = teztools.getCurrentPrice();
    expect(currentPrices).toHaveLength(teztools.numberOfTokens);
    // with wrong params
    try {
      teztools.getCurrentPrice(["kUSD", "KALAM", "tzBTC", "PLENTY", "FAKE"]);
      fail("getCurrentPrice with wrong params shouldn't work");
    } catch (error) {
      expect((error as any).message).toEqual("Unknown token(s)");
      expect((error as any).list.includes("FAKE")).toBeTruthy();
    }
    // with params
    const params = ["kUSD", "KALAM", "tzBTC", "PLENTY"];
    const currentPrices_ = teztools.getCurrentPrice(params);
    expect(currentPrices_).toHaveLength(params.length);
  });
});*/
