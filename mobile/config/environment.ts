import Constants from "expo-constants";

const ENV = {
  dev: {
    apiUrl: 'http://192.168.0.164:3333'
  },
  staging: {
    apiUrl: ''
  },
  prod: {
    apiUrl: ''
  }
}

const getEnvVars = (env  = Constants.manifest.releaseChannel) => {
 // What is __DEV__ ?
 // This variable is set to true when react-native is running in Dev mode.
 // __DEV__ is true when run locally, but false when published.

  if (env === null || env === undefined || env === '' || __DEV__) return ENV.dev
  if (env.indexOf('dev') !== -1) return ENV.dev
  if (env.indexOf('staging') !== -1) return ENV.staging
  if (env.indexOf('prod') !== -1) return ENV.prod
};

export default Object(getEnvVars);