const convertMentionsToLinks = (text: string) => {
    const mentionRegex = /@(\d+)(\s+(\w+\s*){1,\1})#/g;
    return text.replace(mentionRegex, (match, userLogin) => {
      return `<a href="/profile/${userLogin}" class="text-blue-600 hover:underline">${match}</a>`;
    });
  };
//   const convertMentionsToLinks = (text: string) => {
//    // Use regex to find patterns like @words#
//   //  console.log('convertMentions',text)
//   return text.replace(/@([\w\s]+?)#(\w+?)@/g, (match, userName, userId) => {
//     // Log the matched userName and userId for debugging
//     console.log('convertMentions', userName, userId);

//     // Wrap the userName in a link element using userId as href
//     return `<a href="/${userId}" class="text-blue-600 hover:underline">${userName}</a>`;
// });
// }

export default convertMentionsToLinks