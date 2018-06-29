const axios = require("axios");
const qs = require("querystring");
const prettyError = require('../helpers/prettyError')

class API {
  constructor(token) {
    this.token = token;
    return this.proxy;
  }

  get proxy() {
    return new Proxy(
      {},
      {
        get: (target, category) => {
          return new Proxy(
            {},
            {
              get: (target, method) => {
                return async (params, access_token = this.token) => {
                  const url = `https://api.vk.com/method/${category}.${method}?v=5.78 `;

                  const options = {
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    }
                  };

                  const { data } = await axios.post(
                    url,
                    qs.stringify({ ...params, access_token }),
                    options
                  );

                  if (data.error)
                    prettyError(data.error, { type: 'API' })

                  return data.response;
                };
              }
            }
          );
        }
      }
    );
  }
}

module.exports = API;
