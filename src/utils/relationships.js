function deserializeRelation(relation) {
  const relations = {
    Acquaintance: "Acquaintance",
    Colleague: "Colleague",
    Friend: "Friend",
    BestFriend: "Best Friend",
    FamilyFriend: "Family Friend",
    BusinessPartner: "Business Partner",
    LovedOne: "Loved One",
  };
  return relations[relation];
}

function serializeRelation(relation) {
  const relations = {
    Acquaintance: "Acquaintance",
    Colleague: "Colleague",
    Friend: "Friend",
    "Best Friend": "BestFriend",
    "Family Friend": "FamilyFriend",
    "Business Partner": "BusinessPartner",
    "Loved One": "LovedOne",
  };
  return relations[relation];
}

module.exports = {
  serializeRelation,
  deserializeRelation,
};
