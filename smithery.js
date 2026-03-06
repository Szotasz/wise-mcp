export default function startCommand(config) {
  return {
    command: "node",
    args: ["dist/index.js"],
    env: {
      WISE_API_TOKEN: config.WISE_API_TOKEN,
    },
  };
}
