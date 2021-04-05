const assertEnvVar = (varName) => {
  if (!process.env[varName]) {
    throw Error(`required environment variable: "${varName}" is missing. Please update your environment.`);
  }
};

export default assertEnvVar;
