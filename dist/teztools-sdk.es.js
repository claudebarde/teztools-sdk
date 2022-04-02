var tokenType = /* @__PURE__ */ ((tokenType2) => {
  tokenType2["FA12"] = "fa1.2";
  tokenType2["FA2"] = "fa2";
  tokenType2["XTZ"] = "XTZ";
  return tokenType2;
})(tokenType || {});
const validateAddress = (address) => {
  if (typeof address !== "string")
    return false;
  address = address.trim();
  if (address.length === 0)
    return false;
  if (address.slice(0, 2) === "tz") {
    const regex = new RegExp("tz[123][1-9A-HJ-NP-Za-km-z]{33}");
    return regex.test(address);
  } else if (address.slice(0, 2) === "KT") {
    const regex = new RegExp("KT1[1-9A-HJ-NP-Za-km-z]{33}");
    return regex.test(address);
  } else {
    return false;
  }
};
class TezToolsSDK {
  constructor() {
    this.pricesApiUrl = "https://api.teztools.io/v1/prices";
    this.xtzPriceUrl = "https://api.teztools.io/v1/xtz-price";
    this.xtzPrice = void 0;
    this.defaultFiat = "USD";
    this.xtzExchangeRate = void 0;
    this.tokenTags = [];
    this.numberOfTokens = 0;
    this.tokensPrices = [];
    this.tokensList = [];
    if (window) {
      this.fetch = async (url) => {
        const res = await this.fetch(url);
        if (res) {
          return await res.json();
        } else {
          return null;
        }
      };
    } else {
      this.fetch = async (url) => {
        const axios = (await import("./index.js").then(function(n) {
          return n.i;
        })).default;
        const res = await axios.get(url);
        if (res) {
          return res.data;
        } else {
          return null;
        }
      };
    }
  }
  is_number(val) {
    return !isNaN(+val);
  }
  is_timestamp(val) {
    return new Date(val).getTime() > 0;
  }
  is_string(val) {
    return typeof val === "string";
  }
  is_boolean(val) {
    return typeof val === "boolean";
  }
  is_url(val) {
    try {
      new URL(val);
      return true;
    } catch (error) {
      return false;
    }
  }
  async init(p) {
    const prices = p && p.prices ? p.prices : true;
    const xtzPrice = p && p.xtzPrice ? p.xtzPrice : true;
    const defaultFiat = p && p.defaultFiat ? p.defaultFiat : "USD";
    const fiatExchangeRate = p && p.fiatExchangeRate ? p.fiatExchangeRate : void 0;
    if (prices) {
      try {
        const data = await this.fetch(this.pricesApiUrl);
        if (data) {
          if (typeof data !== "object") {
            throw `Expected object from token prices API, got ${typeof data}`;
          } else if (typeof data === "object" && !data.hasOwnProperty("contracts")) {
            throw `Object received from token prices API doesn't have a "contracts" property`;
          } else if (typeof data === "object" && data.hasOwnProperty("contracts") && !Array.isArray(data.contracts)) {
            throw `Expected contracts property from token prices API to be an array, got ${typeof data.contracts} instead`;
          } else {
            this.numberOfTokens = data.contracts.length;
            data.contracts.forEach((contract) => {
              let token = {
                symbol: null,
                tokenAddress: null,
                decimals: null,
                name: null,
                shouldPreferSymbol: null,
                factoryIndex: null,
                address: null,
                ratio: null,
                tezPool: null,
                tokenPool: null,
                currentPrice: null,
                lastPrice: null,
                buyPrice: null,
                sellPrice: null,
                precision: null,
                type: null,
                bakerValidator: null,
                currentCandidate: null,
                currentDelegated: null,
                lastUpdateTime: null,
                lastVeto: null,
                periodFinish: null,
                reward: null,
                rewardPaid: null,
                rewardPerSec: null,
                totalReward: null,
                totalSupply: null,
                qptTokenSupply: null,
                totalVotes: null,
                usdValue: null,
                pairs: [],
                tags: null,
                websiteLink: null,
                telegramLink: null,
                twitterLink: null,
                discordLink: null,
                thumbnailUri: null,
                timestamp: null,
                block: null
              };
              const contractKeys = Object.keys(contract);
              contractKeys.forEach((contractKey) => {
                switch (contractKey) {
                  case "symbol":
                    const symbol = contract[contractKey];
                    if (this.is_string(symbol)) {
                      this.tokensList.push(symbol);
                      token.symbol = symbol;
                    } else {
                      token.symbol = null;
                    }
                    break;
                  case "tokenAddress":
                    const tokenAddress = contract[contractKey];
                    token.tokenAddress = (() => {
                      if (this.is_string(tokenAddress) && validateAddress(tokenAddress)) {
                        return {
                          address: tokenAddress,
                          isValid: true
                        };
                      } else {
                        return null;
                      }
                    })();
                    break;
                  case "decimals":
                    const decimals = contract[contractKey];
                    token.decimals = this.is_number(decimals) ? decimals : null;
                    break;
                  case "name":
                    const name = contract[contractKey];
                    token.name = this.is_string(name) ? name : null;
                    break;
                  case "shouldPreferSymbol":
                    token.shouldPreferSymbol = this.is_boolean(contract[contractKey]) ? contract[contractKey] : null;
                    break;
                  case "factoryIndex":
                    const factoryIndex = contract[contractKey];
                    token.factoryIndex = this.is_number(factoryIndex) ? factoryIndex : null;
                    break;
                  case "address":
                    const address = contract[contractKey];
                    token.address = (() => {
                      if (this.is_string(address) && validateAddress(address)) {
                        return {
                          address,
                          isValid: true
                        };
                      } else {
                        return null;
                      }
                    })();
                    break;
                  case "ratio":
                    const ratio = contract[contractKey];
                    token.ratio = this.is_number(ratio) ? ratio : null;
                    break;
                  case "tezPool":
                    const tezPool = contract[contractKey];
                    token.tezPool = this.is_number(tezPool) ? tezPool : null;
                    break;
                  case "tokenPool":
                    const tokenPool = contract[contractKey];
                    token.tokenPool = this.is_number(tokenPool) ? tokenPool : null;
                    break;
                  case "currentPrice":
                    const currentPrice = contract[contractKey];
                    token.currentPrice = this.is_number(currentPrice) ? currentPrice : null;
                    break;
                  case "lastPrice":
                    const lastPrice = contract[contractKey];
                    token.lastPrice = this.is_number(lastPrice) ? lastPrice : null;
                    break;
                  case "buyPrice":
                    const buyPrice = contract[contractKey];
                    token.buyPrice = this.is_number(buyPrice) ? buyPrice : null;
                    break;
                  case "sellPrice":
                    const sellPrice = contract[contractKey];
                    token.sellPrice = this.is_number(sellPrice) ? sellPrice : null;
                    break;
                  case "precision":
                    const precision = contract[contractKey];
                    token.precision = this.is_number(precision) ? precision : null;
                    break;
                  case "type":
                    const type = contract[contractKey];
                    switch (type) {
                      case "fa1.2":
                        token.type = "fa1.2";
                        break;
                      case "fa2":
                        token.type = "fa2";
                        break;
                      case "XTZ":
                        token.type = "XTZ";
                        break;
                      default:
                        token.type = null;
                        break;
                    }
                    break;
                  case "bakerValidator":
                    const bakerValidator = contract[contractKey];
                    token.bakerValidator = validateAddress(bakerValidator) ? bakerValidator : null;
                    break;
                  case "currentCandidate":
                    const currentCandidate = contract[contractKey];
                    token.currentCandidate = validateAddress(currentCandidate) ? currentCandidate : null;
                    break;
                  case "currentDelegated":
                    const currentDelegated = contract[contractKey];
                    token.currentDelegated = validateAddress(currentDelegated) ? currentDelegated : null;
                    break;
                  case "lastUpdateTime":
                    const lastUpdateTime = contract[contractKey];
                    token.lastUpdateTime = this.is_timestamp(lastUpdateTime) ? lastUpdateTime : null;
                    break;
                  case "lastVeto":
                    const lastVeto = contract[contractKey];
                    token.lastVeto = this.is_timestamp(lastVeto) ? lastVeto : null;
                    break;
                  case "periodFinish":
                    const periodFinish = contract[contractKey];
                    token.periodFinish = this.is_timestamp(periodFinish) ? periodFinish : null;
                    break;
                  case "reward":
                    const reward = contract[contractKey];
                    token.reward = this.is_number(reward) ? reward : null;
                    break;
                  case "rewardPaid":
                    const rewardPaid = contract[contractKey];
                    token.rewardPaid = this.is_number(rewardPaid) ? rewardPaid : null;
                    break;
                  case "rewardPerSec":
                    const rewardPerSec = contract[contractKey];
                    token.rewardPerSec = this.is_number(rewardPerSec) ? rewardPerSec : null;
                    break;
                  case "totalReward":
                    const totalReward = contract[contractKey];
                    token.totalReward = this.is_number(totalReward) ? totalReward : null;
                    break;
                  case "totalSupply":
                    const totalSupply = contract[contractKey];
                    token.totalSupply = this.is_number(totalSupply) ? totalSupply : null;
                    break;
                  case "qptTokenSupply":
                    const qptTokenSupply = contract[contractKey];
                    token.qptTokenSupply = this.is_number(qptTokenSupply) ? qptTokenSupply : null;
                    break;
                  case "totalVotes":
                    const totalVotes = contract[contractKey];
                    token.totalVotes = this.is_number(totalVotes) ? totalVotes : null;
                    break;
                  case "usdValue":
                    const usdValue = contract[contractKey];
                    token.usdValue = this.is_number(usdValue) ? usdValue : null;
                    break;
                  case "pairs":
                    const pairs = contract[contractKey];
                    const tokenPairs = [];
                    pairs.forEach((pair) => {
                      let tokenPair = {
                        address: validateAddress(pair.address) ? pair.address : null,
                        dex: this.is_string(pair.dex) ? pair.dex : null,
                        symbols: this.is_string(pair.symbols) ? pair.symbols : null,
                        tvl: this.is_number(pair.tvl) ? pair.tvl : null,
                        lptSupply: this.is_number(pair.lptSupply) ? pair.tvl : null,
                        sides: Array.isArray(pair.sides) ? [
                          ...pair.sides.map((side) => {
                            let tokenPairSide = {
                              symbol: this.is_string(side.symbol) ? side.symbol : null,
                              pool: this.is_number(side.pool) ? side.pool : null,
                              price: this.is_number(side.price) ? side.price : null,
                              usdvalue: this.is_number(side.usdvalue) ? side.usdvalue : null,
                              dayClose: this.is_number(side.dayClose) ? side.dayClose : null,
                              weekClose: this.is_number(side.weekClose) ? side.weekClose : null,
                              monthClose: this.is_number(side.monthClose) ? side.monthClose : null,
                              tokenType: this.is_string(side.tokenType) ? side.tokenType : null
                            };
                            return tokenPairSide;
                          })
                        ] : null
                      };
                      tokenPairs.push(tokenPair);
                    });
                    token.pairs = tokenPairs;
                    break;
                  case "tags":
                    const tags = contract[contractKey];
                    token.tags = this.is_string(tags) ? tags : null;
                    break;
                  case "websiteLink":
                    const websiteLink = contract[contractKey];
                    token.websiteLink = (() => {
                      if (this.is_string(websiteLink)) {
                        return {
                          url: websiteLink,
                          isValid: this.is_url(websiteLink)
                        };
                      } else {
                        return null;
                      }
                    })();
                    break;
                  case "telegramLink":
                    const telegramLink = contract[contractKey];
                    token.telegramLink = (() => {
                      if (this.is_string(telegramLink)) {
                        return {
                          url: telegramLink,
                          isValid: this.is_url(telegramLink)
                        };
                      } else {
                        return null;
                      }
                    })();
                    break;
                  case "twitterLink":
                    const twitterLink = contract[contractKey];
                    token.twitterLink = (() => {
                      if (this.is_string(twitterLink)) {
                        return {
                          url: twitterLink,
                          isValid: this.is_url(twitterLink)
                        };
                      } else {
                        return null;
                      }
                    })();
                    break;
                  case "discordLink":
                    const discordLink = contract[contractKey];
                    token.discordLink = (() => {
                      if (this.is_string(discordLink)) {
                        return {
                          url: discordLink,
                          isValid: this.is_url(discordLink)
                        };
                      } else {
                        return null;
                      }
                    })();
                    break;
                  case "thumbnailUri":
                    const thumbnailUri = contract[contractKey];
                    token.thumbnailUri = (() => {
                      if (this.is_string(thumbnailUri)) {
                        return {
                          url: thumbnailUri,
                          isValid: this.is_url(thumbnailUri)
                        };
                      } else {
                        return null;
                      }
                    })();
                    break;
                  case "timestamp":
                    const timestamp = contract[contractKey];
                    token.timestamp = this.is_timestamp(timestamp) ? timestamp : null;
                    break;
                  case "block":
                    const block = contract[contractKey];
                    token.block = this.is_string(block) ? block : null;
                    break;
                }
              });
              this.tokensPrices.push(token);
            });
            this.tokenTags = Array.from(new Set(this.tokensPrices.map((tk) => tk.tags).filter((tk) => tk !== null)));
          }
        } else {
          throw "No response from the tokens prices API";
        }
      } catch (error) {
        console.error();
      }
    }
    if (xtzPrice) {
      try {
        const data = await this.fetch(this.xtzPriceUrl);
        if (data) {
          let xtzPrice2 = {
            fullData: true,
            price: null,
            price24h: null,
            marketCap: null,
            market24h: null,
            volume: null,
            volume24h: null,
            updated: null
          };
          const expectedKeys = Object.keys(xtzPrice2);
          const receivedKeys = Object.keys(data);
          const matchingKeys = receivedKeys.map((key) => expectedKeys.includes(key)).reduce((a, b) => a && b);
          if (!matchingKeys || expectedKeys.length === receivedKeys.length) {
            xtzPrice2.fullData = false;
          }
          Object.keys(xtzPrice2).forEach((key) => {
            if (data.hasOwnProperty(key)) {
              if (key === "updated" && this.is_timestamp(data[key])) {
                xtzPrice2.updated = data.updated;
              } else if (this.is_number(data[key])) {
                xtzPrice2[key] = +data[key];
              }
            }
          });
          this.xtzPrice = xtzPrice2;
          if (defaultFiat !== "USD" && fiatExchangeRate) {
            this.defaultFiat = "EUR";
            this.xtzExchangeRate = fiatExchangeRate;
          } else {
            this.xtzExchangeRate = xtzPrice2.price;
          }
        } else {
          throw "No response from the XTZ price API";
        }
      } catch (error) {
        console.error(error);
      }
    }
    return this;
  }
  async refresh(p) {
    return await this.init(p);
  }
  updateInternalFiat(symbol, exchangeRate) {
    this.defaultFiat = symbol;
    this.xtzExchangeRate = exchangeRate;
    return this;
  }
  get(tokenSymbol) {
    if (!this.tokensList.includes(tokenSymbol)) {
      return null;
    } else {
      const result = this.tokensPrices.find((tk) => tk.symbol === tokenSymbol);
      if (result) {
        return result;
      } else {
        return null;
      }
    }
  }
  getBySymbol(tokenSymbol) {
    return this.get(tokenSymbol);
  }
  getByType(type) {
    return this.tokensPrices.filter((tk) => tk.type === type);
  }
  getByAddress(address) {
    const result = this.tokensPrices.find((tk) => tk.tokenAddress ? tk.tokenAddress.address === address : void 0);
    if (result) {
      return result;
    } else {
      return null;
    }
  }
  getByTag(tag, precision) {
    if (precision) {
      return this.tokensPrices.filter((tk) => tk.tags && tk.tags === tag.toLowerCase());
    } else {
      return this.tokensPrices.filter((tk) => tk.tags && tk.tags.toLowerCase().includes(tag.toLowerCase()));
    }
  }
  getTokensList() {
    return this.tokensList.sort((a, b) => a > b ? 1 : -1);
  }
  getTokensWithPriceGreaterThan(price) {
    return this.tokensPrices.filter((tk) => tk.currentPrice ? tk.currentPrice > price : false).sort((a, b) => {
      if (a.currentPrice && b.currentPrice) {
        return a.currentPrice - b.currentPrice;
      } else {
        return 0;
      }
    });
  }
  getTokensWithPriceLessThan(price) {
    return this.tokensPrices.filter((tk) => tk.currentPrice ? tk.currentPrice < price : false).sort((a, b) => {
      if (a.currentPrice && b.currentPrice) {
        return a.currentPrice - b.currentPrice;
      } else {
        return 0;
      }
    });
  }
  orderByUsdValue(dir, tokens) {
    const sortedTokens = this.tokensPrices.sort((a, b) => {
      if (a.usdValue && b.usdValue) {
        return dir === "desc" ? b.usdValue - a.usdValue : a.usdValue - b.usdValue;
      } else {
        return 0;
      }
    });
    if (tokens) {
      const unknownTokens = tokens.filter((tk) => !this.tokensList.includes(tk));
      if (unknownTokens.length > 0) {
        throw { message: "Unknown token(s)", list: unknownTokens };
      }
      return sortedTokens.filter((tk) => tk.symbol ? tokens.includes(tk.symbol) : false);
    } else {
      return sortedTokens;
    }
  }
  orderByUsdValueDesc(tokens) {
    return this.orderByUsdValue("desc", tokens);
  }
  orderByUsdValueAsc(tokens) {
    return this.orderByUsdValue("asc", tokens);
  }
  getCurrentPrice(tokens) {
    const tokensCurrentPrices = this.tokensPrices.map((tk) => ({
      symbol: tk.symbol,
      xtzPrice: tk.currentPrice,
      fiatPrice: tk.currentPrice && this.xtzExchangeRate ? tk.currentPrice * this.xtzExchangeRate : null,
      fiat: this.defaultFiat
    }));
    if (tokens && tokens.length > 0) {
      const unknownTokens = tokens.filter((tk) => !this.tokensList.includes(tk));
      if (unknownTokens.length > 0) {
        throw { message: "Unknown token(s)", list: unknownTokens };
      }
      return tokensCurrentPrices.filter((tk) => tk.symbol ? tokens.includes(tk.symbol) : false);
    } else {
      return tokensCurrentPrices;
    }
  }
}
export { TezToolsSDK, tokenType };
