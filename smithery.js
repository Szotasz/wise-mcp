export default function startCommand(config) {
  const env = {
    WISE_API_TOKEN: config.WISE_API_TOKEN,
    WISE_ENV: config.WISE_ENV || "live",
  };

  return {
    command: "node",
    args: ["dist/index.js"],
    env,
  };
}
