const userModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");

exports.adminLogin = async (req, res, next) => {
  try {
    var result = await userModel.findOne({ email: req.body.email });
    if (!result) {
      return res.status(401).json({
        status: false,
        message: "Auth failed",
      });
    }
    bcrypt.compare(req.body.password, result.password, (err, passed) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: "Auth failed",
        });
      }
      if (passed) {
        const token = jwt.sign(
          {
            email: result.email,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({
          status: true,
          message: "Auth Successful",
          token: token,
        });
      }
      res.status(401).json({
        status: true,
        message: "Auth failed",
      });
    });
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

exports.createAgent = async (req, res, next) => {
  try {
    var fname = req.body.firstName;
    var lname = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var age = req.body.age;
    var dob = req.body.dob;
    var gender = req.body.gender;
    var address = req.body.address;
    var role = "agent";
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (req.query.adminEmail == decoded.email) {
      var findUser = await userModel.findOne({ email: req.query.adminEmail });
      var matchFound = false;
      for (var i = 0; i < findUser.agent.length; i++) {
        if (findUser.agent[i].email == email) {
          matchFound = true;
          break;
        }
      }
      if (matchFound) {
        return res.status(200).json({
          status: false,
          message: "Agent Already Created",
        });
      }

      if (password == confirmPassword) {
        bcrypt.hash(password, 12).then((hashedPassword) => {
          var agent = {
            email: email,
            firstName: fname,
            lastName: lname,
            password: hashedPassword,
            age: age,
            dob: dob,
            gender: gender,
            address: address,
            role: role,
            site: [],
          };

          userModel
            .update({ email: decoded.email }, { $push: { agent: agent } })
            .then(() => {
              return res.status(201).json({
                status: true,
                message: "Agent Created",
              });
            });
        });
      } else {
        return res.json({
          status: false,
          message: "Password Not Matched",
        });
      }
    } else {
      return res.status(401).json({
        status: false,
        message: "Auth Failed",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

exports.agentLogin = async (req, res, next) => {
  try {
    var result = await userModel.findOne({
      "agent.email": req.body.agentEmail,
    });
    if (!result) {
      return res.status(401).json({
        status: false,
        message: "Auth failed",
      });
    }
    for (var i = 0; i < result.agent.length; i++) {
      if (result.agent[i].email == req.body.agentEmail) {
        bcrypt.compare(
          req.body.password,
          result.agent[i].password,
          (err, passed) => {
            if (passed) {
              auth = true;
              var token = jwt.sign(
                {
                  email: result.agent[i].email,
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "1h",
                }
              );
              return res.json({
                status: true,
                message: "Auth Sucessful",
                token: token,
              });
            }
          }
        );
      }
      break;
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

exports.viewAgent = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (req.query.adminEmail == decoded.email) {
      var admin = await userModel.findOne({ email: req.query.adminEmail });
      return res.status(200).json({
        status: true,
        agent: admin.agent,
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "Auth Failed",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

exports.createSite = async (req, res, next) => {
  try {
    var fname = req.body.firstName;
    var lname = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var age = req.body.age;
    var dob = req.body.dob;
    var gender = req.body.gender;
    var address = req.body.address;
    var role = "site";
    var sitematchFound = false;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (req.query.agentEmail == decoded.email) {
      var findsite = await userModel.findOne({
        "agent.site.email": email,
      });

      if (findsite) {
        return res.status(200).json({
          status: false,
          message: "site Already Created",
        });
      }

      if (password == confirmPassword) {
        bcrypt.hash(password, 12).then((hashedPassword) => {
          var site = {
            email: email,
            firstName: fname,
            lastName: lname,
            password: hashedPassword,
            age: age,
            dob: dob,
            gender: gender,
            address: address,
            role: "site",
            cashier: [],
          };

          userModel
            .update(
              { "agent.email": req.query.agentEmail },
              {
                $push: {
                  "agent.$.site": site,
                },
              }
            )
            .then((resul) => {
              return res.status(201).json({
                status: true,
                message: "site Created",
              });
            });
        });
      } else {
        return res.json({
          status: false,
          message: "Password Not Matched",
        });
      }
    } else {
      return res.status(401).json({
        status: false,
        message: "Auth Failed",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

exports.viewSite = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (req.query.agentEmail == decoded.email) {
      var agentdata = await userModel.findOne({
        "agent.email": req.query.agentEmail,
      });
      var obj = {};
      for (var i = 0; i < agentdata.agent.length; i++) {
        if (agentdata.agent[i].email == req.query.agentEmail) {
          obj = agentdata.agent[i].site;
        }
      }

      return res.status(200).json({
        status: true,
        site: obj,
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "Auth Failed",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

exports.siteLogin = async (req, res, next) => {
  try {
    var siteEmail = req.body.siteEmail;
    var sitePassword = req.body.password;
    var adminData = await userModel.findOne({ "agent.site.email": siteEmail });
    if (!adminData) {
      return res.status(401).json({
        status: false,
        message: "Auth failed",
      });
    }
    for (var i = 0; i < adminData.agent.length; i++) {
      for (var j = 0; j < adminData.agent[i].site.length; j++) {
        if (adminData.agent[i].site[j].email == siteEmail) {
          bcrypt.compare(
            sitePassword,
            adminData.agent[i].site[j].password,
            (err, passed) => {
              if (passed) {
                console.log(passed);
                found = true;
                var token = jwt.sign(
                  {
                    email: siteEmail,
                  },
                  process.env.JWT_KEY,
                  {
                    expiresIn: "1h",
                  }
                );
                return res.json({
                  status: true,
                  message: "Auth Sucessful",
                  token: token,
                });
              }
            }
          );
          break;
        }
      }
    }
    // setTimeout(function () {
    //   res.json({
    //     status: false,
    //     message: "Auth failed",
    //   });
    // }, 3000);
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

exports.createCashier = async (req, res, next) => {
  try {
    var fname = req.body.firstName;
    var lname = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var age = req.body.age;
    var dob = req.body.dob;
    var gender = req.body.gender;
    var address = req.body.address;
    var role = "cashier";

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (req.query.siteEmail == decoded.email) {
      var findcashier = await userModel.findOne({
        "agent.site.cashier.email": email,
      });

      if (findcashier) {
        return res.status(200).json({
          status: false,
          message: "cashier Already Created",
        });
      }
      if (password == confirmPassword) {
        bcrypt.hash(password, 12).then((hashedPassword) => {
          var cashier = {
            email: email,
            firstName: fname,
            lastName: lname,
            password: hashedPassword,
            age: age,
            dob: dob,
            gender: gender,
            address: address,
            role: "cashier",
          };

          userModel
            .update(
              { "agent.site.email": req.query.siteEmail },
              {
                $push: {
                  "agent.$.site.$[i].cashier": cashier,
                },
              },
              { arrayFilters: [{ "i.email": req.query.siteEmail }] }
            )
            .then(() => {
              return res.status(201).json({
                status: true,
                message: "site Created",
              });
            });
        });
      } else {
        return res.json({
          status: false,
          message: "Password Not Matched",
        });
      }
    } else {
      return res.status(401).json({
        status: false,
        message: "Auth Failed",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

exports.viewCashier = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (req.query.siteEmail == decoded.email) {
      var agentdata = await userModel.findOne({
        "agent.site.email": req.query.siteEmail,
      });
      var obj = {};
      for (var i = 0; i < agentdata.agent.length; i++) {
        for (var j = 0; j < agentdata.agent[i].site.length; j++)
          if (agentdata.agent[i].site[j].email == req.query.siteEmail) {
            obj = agentdata.agent[i].site[j].cashier;
          }
      }

      return res.status(200).json({
        status: true,
        cashier: obj,
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "Auth Failed",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};
