//truncateDescription function
//Max 50 characters in challenge description
export function truncateDescription(description, maxLength = 50) {
   if (description.length <= maxLength) {
    return description;
  }
 
  // Hitta första mellanslaget efter maxLength
  const nextSpace = description.indexOf(" ", maxLength);

  // Om det inte finns ett mellanslag efter maxLength,
  // kan vi inte kapa utan att bryta ett ord – då returnerar vi originalet
  if (nextSpace === -1) {
    return description;
  }

  // Ta allt fram till mellanslaget efter ordet
  const cutIndex = nextSpace;

  return description.slice(0, cutIndex).trimEnd() + "...";
}

//module.exports = { truncateDescription };
