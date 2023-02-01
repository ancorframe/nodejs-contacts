const { Contacts } = require("../db/contactModel");

const getContacts = async (userId, page, limit, filters) => {
  const contacts = await Contacts.find({ owner: userId, ...filters }, { __v: 0 })
    .skip(page)
    .limit(limit);
  return contacts;
};

const getContactsById = async (postId, userId) => {
  const contact = await Contacts.findOne(
    { _id: postId, owner: userId },
    { __v: 0 }
  );
  return contact;
};

const addContacts = async (body, userId) => {
  const { name, email, phone, favorite = false } = body;
  const contact = new Contacts({ name, email, phone, favorite, owner: userId });
  const savedContact = await contact.save();
  return savedContact;
};

const updateContactsById = async (postId, body, userId) => {
 await Contacts.findOneAndUpdate(
    { _id: postId, owner: userId },
    {
      $set: { ...body },
    }
  );
  const contact = await Contacts.findOne({ _id: postId, owner: userId },{__v:0});
  return contact;
};

const deleteContactsById = async (postId, userId) => {

  const removeContact = await Contacts.findOneAndDelete({
    _id: postId,
    owner: userId,
  });
  return removeContact;
};

const updateFavoriteById = async (postId, favorite, userId) => {
await Contacts.findOneAndUpdate(
    { _id: postId, owner: userId },
    {
      $set: { favorite },
    }
);
  const contact = await Contacts.findOne({ _id: postId, owner: userId },{favorite:1});
  return contact;
};

module.exports = {
  getContacts,
  getContactsById,
  addContacts,
  updateContactsById,
  deleteContactsById,
  updateFavoriteById,
};
