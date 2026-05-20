import BankAccount from "../models/bankModel.js";
// add a new bank account
export const addBankAccount = async (req, res) => {
  try {
    const bankAccount = new BankAccount({
      ...req.body,
      user: req.user._id,
    });
    await bankAccount.save();
    res.status(201).send(bankAccount);
  } catch (error) {
    res.status(400).send(error);
  }
};
export const getBankAccount = async (req, res) => {
  try {
    const bankAccounts = await BankAccount.find({ userId: req.user._id });

    res.send(bankAccounts);
  } catch (error) {
    res.status(500).send();
  }
};
export const getBankAccountById = async (req, res) => {
  try {
    const bankAccount = await BankAccount.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!bankAccount) {
      return res.status(404).send();
    }
    res.send(bankAccount);
  } catch (error) {
    res.status(500).send();
  }
};
export const updateBankAccount = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["accountName", "balance"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update),
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const bankAccount = await BankAccount.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!bankAccount) {
      return res.status(404).send();
    }

    updates.forEach((update) => (bankAccount[update] = req.body[update]));
    await bankAccount.save();
    res.send(bankAccount);
  } catch (error) {
    res.status(400).send(error);
  }
};
export const deleteBankAccount = async (req, res) => {
  try {
    const bankAccount = await BankAccount.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!bankAccount) {
      return res.status(404).send();
    }
    res.send(bankAccount);
  } catch (error) {
    res.status(500).send();
  }
};
