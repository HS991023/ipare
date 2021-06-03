const { Request, SimpleStartup } = require("sfa");
import "@sfajs/router";

exports.main = async () => {
  return await new SimpleStartup(new Request())
    .use(async (ctx, next) => {
      ctx.res.headers.demo = "js";
      await next();
    })
    .useRouter()
    .run();
};
