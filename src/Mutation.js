const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");

const Mutation = {
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    args.password = bcrypt.hashSync(args.password);
    const company = await ctx.db.mutation.createCompany(
      { data: { ...args } },
      info
    );
    const TIME = 60 * 60 * 24 * 365;
    const token = jwt.sign({ companyID: company.id }, process.env.APP_SECRET, {
      expiresIn: TIME
    });
    ctx.response.cookie("token", token, {
      httpOnly: false
    });
    return company;
  },
  async addQuestion(parent, args, ctx, info) {
    const { companyID } = ctx.request;
    if (!companyID) {
      throw new Error("You must be logged in.");
    }
    const question = await ctx.db.mutation.createQuestion(
      {
        data: { ...args, company: { connect: { id: companyID } } }
      },
      info
    );
    return question;
  },

  async addResponse(parent, args, ctx, info) {
    const { questionID } = args;
    delete args.questionID;
    const response = await ctx.db.mutation.createResponse(
      {
        data: { ...args, question: { connect: { id: questionID } } }
      },
      info
    );
    return response;
  }
};

module.exports = Mutation;
