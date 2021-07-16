const User = require('../models/user-model')
const { validationResult } = require('express-validator')

//GET Users
exports.getUsers = async (req, res) => {
  const pageSize = +req.query.pagesize
  const currentPage = +req.query.currentpage
  const userQwery = User.find({})
  let foundUsers = {}

  try {
    if (pageSize && currentPage) {
      foundUsers = await userQwery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
    }

    //queries
    foundUsers = await userQwery
    const totalUsersLength = await User.countDocuments()

    if (!foundUsers)
      throw new Error()

    res.status(200).send({
      message: 'fetched data successfully',
      users: foundUsers,
      totalUsersLength,
    })
  } catch (error) {
    res.status(404).send({
      message: 'no data found, try again !!',
      users: undefined,
      totalUsersLength: undefined
    })
  }
}

//LOGIN
exports.userLogin = async (req, res) => {
  console.log(req.body, "req.body");
  try {
    const { email, password } = req.body
    const foundUser = await User.findByCredentials(email, password);
    const token = await foundUser.generateAuthToken();
    res.send({ foundUser, token });
  } catch (error) {
    res.status(400).send({ message: 'Invalid username or password' });
  }
}

//SIGNUP
exports.userSignup = async (req, res) => {

  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    console.log(validationErrors);
    return res.status(400).send({ message: 'Some values are invalid !' })
  }

  try {
    const newUser = new User(req.body)
    await newUser.save()
    const token = await newUser.generateAuthToken();

    if (!token)
      throw new Error();

    res.status(201).send({ newUser, token });
  } catch (error) {
    console.log(error, "[signup error]");
    if (error.code == 11000)
      return res.status(500).send({
        message: `${req.body.email} is already registered , try with another !`
      })
    res.status(500).send({ message: 'Signup Failed, try again !' })
  }
}

//DELETE User
exports.deleteUser = async (req, res) => {
  if (req.user.designation !== "admin") {
    return res.status(403).send({ error: 'Request forbidden' });
  }

  const deletingUser = await User.findOne({ _id: req.params.id })
  try {
    if (!deletingUser)
      return res.status(401).send({ error: 'Unable to find the user' });

    await deletingUser.remove()
    res.status(200).send({ success: 'Removed successfully !' })
  } catch (error) {
    res.status(500).send({ success: error.message })
  }
}


