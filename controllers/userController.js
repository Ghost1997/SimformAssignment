const userModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.createAdmin = async (req, res, next) => {
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
    var role = "admin";
    var result = await userModel.findOne({ email: email });
    if (result) {
      return res.json({
        status: false,
        message: "Admin Already Registered",
      });
    }
    if (password == confirmPassword) {
      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          var user = new userModel({
            email: email,
            firstName: fname,
            lastName: lname,
            password: hashedPassword,
            age: age,
            dob: dob,
            gender: gender,
            address: address,
            role: role,
            agent: [],
          });
          return user.save();
        })
        .then(() => {
          return res.json({
            status: true,
            message: "Admin Registered Sucessfully",
          });
        })
        .catch((err) => {
          console.log(err);
          return res.json({
            status: false,
            message: err.message,
          });
        });
    } else {
      return res.json({
        status: false,
        message: "Password Not Matched",
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
            firstName: result.firstName,
            lastName: result.lastName,
            dob: result.dob,
            age: result.age,
            gender: result.gender,
            address: result.address,
            agent: result.agent,
            role: result.role,
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

exports.viewAgent = async (req, res, next) => {
  try {
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
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message: err.message,
    });
  }
};
