const { BadRequest, NotFound } = require("../helpers/errors");
const {
  getContacts,
  getContactsById,
  addContacts,
  updateContactsById,
  deleteContactsById,
  updateFavoriteById,
} = require("../services/contactsServices");

const getContactsController = async (req, res) => {
  const { _id: userId } = req.user;

  let { page = 1, limit = 10, ...filters } = req.query;
  page = parseInt(page) - 1;
  limit = parseInt(limit);
  const contacts = await getContacts(userId, page, limit, filters);
  res.json({ contacts });
};

const getContactsByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { postId } = req.params;
  try {
    const contact = await getContactsById(postId, userId);
    res.json({ contact });
  } catch (error) {
    throw new BadRequest(`Contact with id ${postId} not found`);
  }
};

const addContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  const body = req.body;
  const contact = await addContacts(body, userId);
  res.status(201).json({ contact });
};

const updateContactsByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { postId } = req.params;
  try {
    const updateContact = await updateContactsById(postId, req.body, userId);
    res.json({ message: `contact with id:${postId} updated`, updateContact });
  } catch (error) {
    throw new NotFound(`Contact with id ${postId} not found`);
  }
};

const deleteContactsByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { postId } = req.params;
  try {
    await deleteContactsById(postId, userId);
    res.json({ message: `contact with id:${postId} deleted` });
  } catch (error) {
    throw new NotFound(`Contact with id ${postId} not found`);
  }
};

const updateFavoriteByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { postId } = req.params;
  const { favorite } = req.body;
  if (!favorite) {
    throw new BadRequest("missing field favorite");
  }
  try {
    await updateFavoriteById(postId, favorite, userId);
    res.json({
      message: `contact with id:${postId} set favorite to ${favorite}`,
    });
  } catch (error) {
    throw new NotFound(`Contact with id ${postId} not found`);
  }
};

module.exports = {
  getContactsController,
  getContactsByIdController,
  addContactsController,
  updateContactsByIdController,
  deleteContactsByIdController,
  updateFavoriteByIdController,
};
