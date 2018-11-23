const { forwardTo } = require("prisma-binding");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");

const Query = {
  async question(parent, args, ctx, info) {
    const { questionID } = args;
    const question = await ctx.db.query.question(
      { where: { id: questionID } },
      info
    );
    const { companyID } = ctx.request;
    if (companyID) {
      const companyQuestions = await ctx.db.query.questions(
        {
          where: { id: questionID, company: { id: companyID } }
        },
        info
      );
      if (companyQuestions.length === 0) {
        if (!question.isPublic) question.responses = [];
      }
    } else {
      if (!question.isPublic) question.responses = [];
    }
    return question;
  },

  async questions(parent, args, ctx, info) {
    const { companyID } = ctx.request;
    if (!companyID) {
      throw new Error("You must be logged in");
    }
    const questions = await ctx.db.query.questions(
      { where: { company: { id: companyID } } },
      info
    );
    return questions;
  },

  async me(parent, args, ctx, info) {
    const { companyID } = ctx.request;
    if (!companyID) {
      return null;
    }
    const company = await ctx.db.query.company(
      {
        where: { id: companyID }
      },
      info
    );

    return company;
  },

  async signin(parent, { email, password }, ctx, info) {
    let company = await ctx.db.query.company({
      where: { email }
    });
    if (!company) {
      throw new Error(`No such user found ${email}`);
    }
    if (!bcrypt.compareSync(password, company.password)) {
      throw new Error("Invalid Password");
    }
    const TIME = 60 * 60 * 24;
    const token = jwt.sign({ companyID: company.id }, process.env.APP_SECRET, {
      expiresIn: TIME
    });
    ctx.response.cookie("token", token, {
      httpOnly: false,
      maxAge: TIME
    });
    company = await ctx.db.query.company(
      {
        where: { email }
      },
      info
    );
    return company;
  }
};

module.exports = Query;
